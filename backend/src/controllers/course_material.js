// Controller file for Viewing course content
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');


AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();
const cloudfrontPublicKeyId = process.env.CLOUDFRONT_PUBLIC_KEY_ID;
const cloudfrontPrivateKey = fs.readFileSync(process.env.CLOUDFRONT_PRIVATE_KEY_PATH, 'utf8');
const cloudFrontSigner = new AWS.CloudFront.Signer(cloudfrontPublicKeyId, cloudfrontPrivateKey);

let sequelizeInstance; // Sequelize instance

// Setter function to set the Sequelize instance
function setSequelize(sequelize) {
    sequelizeInstance = sequelize;
}

// List all materials for a specific course
async function listAllMaterialsForCourse(req, res) {
    const { courseId } = req.params;
    try {
        const materials = await getCourseMaterial().findAll({ where: { course_id: courseId } });
        res.json(materials);
    } catch (error) {
        res.status(500).json({ message: 'Error listing materials for course', error: error.message });
    }
};

// Add a new material for a specific course
async function addMaterialForCourse(req, res) {
    const { courseId } = req.params;

    const allowedFileTypes = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'audio/mpeg', 'video/mp4'];
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

// Check if the uploaded file's mimetype is one of the allowed types
    if (!allowedFileTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ message: 'Unsupported file type' });
    }


    const file = req.file; // Assuming you're using multer or similar middleware for file upload
    const material = await getCourseMaterial().findOne({ where: { file_name: file.originalname, course_id: courseId } });
    if (material) {
        return res.status(400).json({ message: 'File already exists' });
    }

    const filename = uuidv4(); // Generate a unique filename

    try {
        // Upload file to S3
        const uploadParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: filename,
            Body: file.buffer,
            ContentType: file.mimetype
        };

        const uploadResult = await s3.upload(uploadParams).promise();

        // Insert metadata into the database
        const material = await getCourseMaterial().create({
            URI: uploadResult.Key,
            file_name: file.originalname,
            file_type: file.mimetype,
            course_id: courseId
        });

        res.status(201).json(material);
    } catch (error) {
        res.status(500).json({ message: 'Error adding material for course', error: error.message });
    }
};

// Update a material for a specific course
async function  updateMaterialForCourse(req, res) {
    const { courseId, id } = req.params;
    const file=req.file;

    const allowedFileTypes = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'audio/mpeg', 'video/mp4'];
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

// Check if the uploaded file's mimetype is one of the allowed types
    if (!allowedFileTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ message: 'Unsupported file type' });
    }
    try {
        const material = await getCourseMaterial().findOne({ where: { material_id: id, course_id: courseId } });
        if (material === null) {
            return res.status(404).json({ message: 'Material not found for course' });
        }

        let params={
            Bucket: process.env.S3_BUCKET_NAME,
            Key:material.URI,
            Body: file.buffer,
            ContentType: file.mimetype
        };
        console.log(params)

            try {
                await s3.upload(params).promise()
                console.log("file updated in S3")
            }
            catch (err) {
                console.log("ERROR in file Updating : " + JSON.stringify(err))
                return  res.status(400)
            }

        await material.update({ updated_at: new Date() });
        res.json({ message: 'Material updated successfully for course' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating material for course', error: error.message });
    }

};

// Delete a material for a specific course
async function deleteMaterialForCourse(req, res) {
    const { courseId, id } = req.params;
    try {
        const material = await getCourseMaterial().findOne({ where: { material_id: id, course_id: courseId } });
        if (material === null) {
            return res.status(404).json({ message: 'Material not found for course' });
        }
        let params={
            Bucket: process.env.S3_BUCKET_NAME,
            Key:material.URI,
        };
        console.log(params)

        try {
            await s3.headObject(params).promise()
            console.log("File Found in S3")
            try {
                await s3.deleteObject(params).promise()
                console.log("file deleted From S3")
            }
            catch (err) {
                console.log("ERROR in file Deleting : " + JSON.stringify(err))
                return  res.status(400)
            }
        } catch (err) {
            console.log("File not Found ERROR : " + err.code)
            return  res.status(404).json({"error": "file not found"})
        }
        await material.destroy();
        res.json({ message: 'Material deleted successfully for course' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting material for course', error: error.message });
    }
};

async function viewMaterialForCourse(req, res){

    const {courseId, materialId } = req.params;

    try {
        const material = await getCourseMaterial().findOne({where: {material_id: materialId, course_id: courseId}});

        if (!material) {
            return res.status(404).json({message: 'Material not found for the course'});
        }

        // Generate a cloudfront signed URL for the S3 course material objects
        const oneDay = 24*60*60*1000;
        const signedUrl = cloudFrontSigner.getSignedUrl({
            url: `https://${process.env.CLOUDFRONT_DOMAIN_NAME}/${material.URI}`,
            expires: Math.floor((Date.now() + oneDay) / 1000), // URL expires in now + 1 day
        });

        res.json({ downloadLink: signedUrl });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error in obtaining link for the course material', error: error.message });
    }
}

function getCourseMaterial()  {
    if (!sequelizeInstance) {
        throw new Error('Sequelize is not initialized');
    }

    const CourseMaterial = require('../models/course_material')(sequelizeInstance)
    return CourseMaterial
}

module.exports = {
    setSequelize,
    listAllMaterialsForCourse,
    addMaterialForCourse,
    updateMaterialForCourse,
    deleteMaterialForCourse,
    viewMaterialForCourse
};

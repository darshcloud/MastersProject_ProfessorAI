import React from 'react';
import FileViewer from 'react-file-viewer';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "./filepreview.css";

const FilePreview = ({ fileType, filePath }) => {
    const onError = e => {
        console.log(e, 'error in file-viewer');
    };

    const renderFilePreview = () => {
        if (fileType === 'ppt' || fileType === 'pptx') {
            return (
                <DocViewer
                    pluginRenderers={DocViewerRenderers}
                    documents={[{ uri: filePath, fileType: fileType }]}
                    style={{ height: '100%', width: '100%' }}
                />
            );
        } else {
            return (
                <FileViewer
                    fileType={fileType}
                    filePath={filePath}
                    errorComponent={CustomErrorComponent}
                    onError={onError}
                />
            );
        }
    };

    return (
        <div style={{ height: '600px' }}>
            {renderFilePreview()}
        </div>
    );
};

const CustomErrorComponent = () => <div>Error in file preview</div>;

export default FilePreview;

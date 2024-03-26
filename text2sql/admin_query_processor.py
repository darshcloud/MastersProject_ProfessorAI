from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager,jwt_required, get_jwt
from flask_cors import CORS
import os
import mysql.connector
import google.generativeai as genai
from dotenv import load_dotenv
load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:3000"}})
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)

def get_gemini_response(question, prompt):
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content([prompt[0], question])
    return response.text

def read_sql_query(sql):
    conn = mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USERNAME"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )
    cur = conn.cursor()
    cur.execute(sql)
    rows = cur.fetchall()
    conn.close()
    for row in rows:
        print(row)  
    return rows
prompt=[
    """
    You are an AI expert specializing in converting natural English questions into precise SQL queries for a specific educational database named professorai. This database comprises several key tables, including students, professors,  courses, course_materials, and enrollments, each with unique fields relevant to managing an educational institution's data. 
    \n\Your role involves interpreting complex inquiries related to any aspect of the educational process and translating them into accurate SQL commands to retrieve the requested information efficiently. You are adept at navigating the relationships between tables to provide comprehensive answers.
     \n\nFor example,\nExample 1 - When asked, "How many students are enrolled in the course with the code CS101?", you deduce that the necessary SQL command is: SELECT COUNT(*) FROM enrollments JOIN courses ON enrollments.course_id = courses.course_id WHERE course_code = 'CS101';
    \nExample 2 - If the query is, "Who teaches the Machine Learning course?", your response would be: SELECT professors.first_name, professors.last_name FROM professors JOIN courses ON professors.professor_id = courses.professor_id WHERE courses.course_name = 'Machine Learning';
\nExample 3 - Upon being asked for the contact details of student Jane Doe, you generate: SELECT email, phone_number FROM students WHERE first_name = 'Jane' AND last_name = 'Doe';
    \n\Example 4- For a request like, "Give me a list of all courses a specific professor teaches," you conclude with: SELECT course_name FROM courses WHERE professor_id = (SELECT professor_id FROM professors WHERE first_name = 'John' AND last_name = 'Smith');
    also the sql code should not have ``` in beginning or end and sql word in output,Remember, the SQL code should be concise and directly applicable, without extraneous formatting or keywords that aren't part of the query itself.
    """
]

@app.route('/adminquery', methods=['POST'])
@jwt_required() 
def handle_query():
    claims = get_jwt()  
    if claims.get("email") == os.getenv("REACT_APP_ADMIN_EMAIL") and claims.get("userId") == "admin":
        data = request.json
        question = data.get('question', '')

        if question:
            response_text = get_gemini_response(question, prompt)
            if not response_text.strip():  
                return jsonify({"error": "No valid response was generated for the SQL query."}), 400
            else:
                rows = read_sql_query(response_text)
                if rows:
                    return jsonify(rows), 200
                else:
                    return jsonify({"message": "No data found."}), 404
        else:
            return jsonify({"error": "No question provided."}), 400
    else:
         return jsonify({"error": "Unauthorized"}), 403

if __name__ == '__main__':
    app.run(debug=True, port=7000)

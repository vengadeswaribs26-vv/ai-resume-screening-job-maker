export interface PreloadedSampleResume {
  id: string;
  candidateName: string;
  role: string;
  fileName: string;
  preview: string;
  rawText: string;
  degree: string;
  experienceYears: number;
}

export const SAMPLE_RESUMES: PreloadedSampleResume[] = [
  {
    id: 'sample_fullstack',
    candidateName: 'Jane Doe',
    role: 'Full Stack Engineer',
    fileName: 'Jane_Doe_FullStack_Resume.pdf',
    degree: 'B.Sc in Computer Science, University of Technology (2022)',
    experienceYears: 3,
    preview: 'React, Node.js, TypeScript, Python, PostgreSQL, REST API, Docker, Git',
    rawText: `JANE DOE
Software Engineer | Full Stack Developer
Email: jane.doe@example.com | Phone: +1 (555) 345-6789 | Location: San Francisco, CA
LinkedIn: linkedin.com/in/janedoe-dev | GitHub: github.com/janedoe

PROFESSIONAL SUMMARY
Dynamic and detail-oriented Full Stack Developer with 3+ years of experience engineering scalable web applications. Proficient in React, Node.js, TypeScript, and relational databases. Proven track record of reducing page load latency by 35% and delivering resilient RESTful APIs.

EDUCATION
B.Sc in Computer Science, Honors
University of Technology, California (Graduated: May 2022)
Relevant Coursework: Data Structures & Algorithms, Database Systems, Web Engineering, Software Architecture

TECHNICAL SKILLS
• Programming Languages: JavaScript, TypeScript, Python, Java, SQL, HTML5, CSS3
• Frameworks & Libraries: React, React.js, Next.js, Node.js, Express.js, Tailwind CSS, Redux
• Databases: PostgreSQL, MySQL, Redis, MongoDB
• Cloud & DevOps Tools: Docker, Git, GitHub, AWS, Postman, Linux, CI/CD
• Methodologies: Agile, Scrum, REST API development, Microservices, Unit Testing (Jest)

PROFESSIONAL EXPERIENCE
Software Engineer | NexaTech Solutions (2022 - Present)
• Architected and deployed responsive user dashboards using React, TypeScript, and Tailwind CSS.
• Built high-throughput microservices using Node.js and Express with PostgreSQL database clustering.
• Implemented automated CI/CD deployment pipelines utilizing Docker containers on AWS EC2.
• Collaborated in bi-weekly Agile sprints, conducting code reviews and unit testing with Jest.

Junior Web Developer | BrightCloud Media (2021 - 2022)
• Developed interactive web modules using JavaScript, React, and CSS3.
• Integrated third-party REST APIs and payment gateways.
• Optimized database queries in PostgreSQL, improving query response times by 28%.

CERTIFICATIONS
• AWS Certified Cloud Practitioner (2023)
• Meta Front-End Developer Professional Certificate (2022)

PROJECTS
• AI-Enhanced E-Commerce Engine: Built with React, Next.js, Node.js, and Stripe API.
• Distributed Task Manager: Microservices application built in Python and Redis.`
  },
  {
    id: 'sample_data_scientist',
    candidateName: 'Alex Chen',
    role: 'AI & Data Science Specialist',
    fileName: 'Alex_Chen_DataScientist_CV.docx',
    degree: 'B.Sc in Data Science & Machine Learning (2021)',
    experienceYears: 4,
    preview: 'Python, SQL, Machine Learning, TensorFlow, Pandas, Scikit-Learn, PyTorch, Docker',
    rawText: `ALEX CHEN
Data Scientist & Machine Learning Engineer
Email: alex.chen@example.com | Phone: +1 (555) 876-5432 | Location: New York, NY
GitHub: github.com/alexchen-ai | Portfolio: alexchen.dev

PROFESSIONAL SUMMARY
Machine Learning Specialist and Data Scientist with 4 years of experience building predictive models, NLP pipelines, and data architectures. Skilled in Python, SQL, TensorFlow, and statistical modeling.

EDUCATION
B.Sc in Data Science & Machine Learning
Columbia University, New York (2017 - 2021)
GPA: 3.85 / 4.0

TECHNICAL SKILLS
• Programming Languages: Python, R, SQL, C++, Bash
• ML & Deep Learning: Machine Learning, Deep Learning, TensorFlow, PyTorch, Scikit-Learn, Keras, NLP, OpenCV
• Data Analysis & Tools: Pandas, NumPy, Matplotlib, Seaborn, Jupyter, Apache Spark
• Databases & Cloud: PostgreSQL, MySQL, SQLite, MongoDB, AWS S3, Google Cloud, Docker, Git

WORK EXPERIENCE
Senior Machine Learning Engineer | DeepMatrix AI (2022 - Present)
• Designed end-to-end NLP classification pipelines analyzing over 500,000 text documents weekly.
• Trained neural network models using PyTorch and TensorFlow with 94.2% test accuracy.
• Deployed real-time inference microservices using FastAPI and Docker on AWS.

Data Analyst / ML Associate | Quantix Analytics (2021 - 2022)
• Performed extensive data cleaning, EDA, and statistical hypothesis testing with Pandas and SQL.
• Created predictive churn models using Scikit-Learn (Random Forest, XGBoost) boosting retention by 18%.

CERTIFICATIONS
• DeepLearning.AI Deep Learning Specialization
• AWS Certified Machine Learning - Specialty (2023)`
  },
  {
    id: 'sample_cloud_devops',
    candidateName: 'Priya Patel',
    role: 'Cloud & DevOps Engineer',
    fileName: 'Priya_Patel_DevOps_Resume.pdf',
    degree: 'B.Tech in Information Technology (2020)',
    experienceYears: 5,
    preview: 'AWS, Kubernetes, Docker, Terraform, CI/CD, Linux, Python, Jenkins, Prometheus',
    rawText: `PRIYA PATEL
Lead DevOps & Cloud Infrastructure Engineer
Email: priya.patel@example.com | Phone: +1 (555) 432-1098 | Location: Austin, TX
LinkedIn: linkedin.com/in/priyapatel-devops

PROFESSIONAL SUMMARY
Certified Cloud & DevOps Engineer with 5+ years of experience architecting cloud infrastructure, automating CI/CD pipelines, and maintaining Kubernetes clusters.

EDUCATION
B.Tech in Information Technology
National Institute of Technology (2016 - 2020)

TECHNICAL SKILLS
• Cloud Platforms: AWS, Amazon Web Services, Google Cloud, Azure
• Containerization & Orchestration: Docker, Kubernetes, Helm
• Infrastructure as Code: Terraform, Ansible
• CI/CD & Automation: Jenkins, GitHub Actions, GitLab CI/CD
• Scripting & OS: Python, Bash, Shell, Linux, Unix
• Monitoring & Logging: Prometheus, Grafana, Elasticsearch

EXPERIENCE
Cloud Infrastructure Engineer | ScaleSphere Systems (2021 - Present)
• Managed AWS multi-region infrastructure handling 10M+ daily requests using Terraform.
• Automated deployment cycles with GitHub Actions, reducing deployment time from 45m to 4m.
• Containerized 30+ legacy services with Docker and orchestrated them on Kubernetes (EKS).

CERTIFICATIONS
• AWS Certified Solutions Architect - Associate
• Certified Kubernetes Administrator (CKA)`
  },
  {
    id: 'sample_fresher',
    candidateName: 'Rohan Sharma',
    role: 'Recent CS Graduate / Junior Developer',
    fileName: 'Rohan_Sharma_EntryLevel_Resume.pdf',
    degree: 'B.Sc in Computer Science (2024)',
    experienceYears: 1,
    preview: 'Python, Java, JavaScript, HTML, CSS, React, SQL, Git, Data Structures',
    rawText: `ROHAN SHARMA
Aspiring Software Developer
Email: rohan.sharma@example.com | Phone: +1 (555) 789-0123 | Location: Seattle, WA

CAREER OBJECTIVE
Enthusiastic Computer Science graduate seeking an entry-level software engineering role to apply strong foundations in Python, Java, SQL, and Web Development.

EDUCATION
B.Sc in Computer Science
City University of Seattle (Graduated: June 2024)
CGPA: 8.9 / 10.0

TECHNICAL SKILLS
• Programming: Python, Java, JavaScript, SQL, C++, HTML5, CSS3
• Frameworks: React, Bootstrap, Flask
• Tools & Concepts: Git, GitHub, MySQL, SQLite, Data Structures & Algorithms, Object-Oriented Programming, REST API

PROJECTS
• Library Management Web Portal: Built with Python Flask, SQLite, HTML5, and Bootstrap.
• Weather Forecasting React App: Live weather tracking using OpenWeather API and React.
• Student Performance Predictor: Python project using Pandas and Scikit-Learn regression models.

INTERNSHIP
Web Development Intern | CodeCraft Labs (Summer 2023)
• Developed responsive frontend pages using HTML, CSS, and JavaScript.
• Fixed 25+ UI bugs and collaborated via GitHub version control.`
  }
];

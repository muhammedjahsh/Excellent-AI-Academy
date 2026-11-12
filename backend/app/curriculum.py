"""Curriculum as data. Titles follow the project brief; only the SQL module has full content so far."""
TRACKS = {
 "data-analytics": ("Data Analytics", ["Intro & careers","Excel fundamentals","Advanced Excel & dashboards","SQL fundamentals","Advanced SQL","Python fundamentals","NumPy & Pandas, EDA","Statistics for analytics","Visualization (Matplotlib/Seaborn/Plotly)","Power BI","Tableau","BI, KPIs & storytelling","AI-assisted analytics","Portfolio & interview prep"]),
 "data-science": ("Data Science", ["Foundations & problem formulation","Python for DS","NumPy, Pandas, EDA","Probability & inference","Linear algebra & calculus","Visualization & storytelling","Feature engineering","Supervised learning","Unsupervised learning","Model evaluation","Tuning, pipelines, leakage","Time series","NLP","Deep learning","Explainability & fairness","Deployment (FastAPI/Flask)","MLOps","Research methods & interviews"]),
 "data-engineering": ("Data Engineering", ["Fundamentals & architecture","Python for pipelines","SQL & relational design","PostgreSQL, MySQL, NoSQL","Linux, Git, workflows","Data formats","ETL/ELT","REST API ingestion","Warehousing & dimensional modeling","Lakes & lakehouses","Spark/PySpark","Airflow","Streaming & Kafka","Cloud data engineering","Data quality & observability","Docker & CI/CD","Security & governance","Optimization & interviews"]),
 "ai-engineering": ("AI & Generative AI Engineering", ["AI/ML/DL/GenAI foundations","Python for AI","NumPy, Pandas, data prep","ML & DL fundamentals","Transformers & attention","LLM concepts","Prompting & tool calling","Model APIs & open models","Hugging Face","Embeddings & vector DBs","RAG","Multimodal AI","LLM evaluation","Fine-tuning (LoRA/QLoRA)","App development","Agentic AI","AI security","LLMOps","Deployment","Portfolio & interviews"]),
}
LESSON = {"title":"SQL Fundamentals: SELECT, WHERE, JOIN, GROUP BY","track":"data-analytics","module":4,
 "sections":[
 {"h":"Simple idea","t":"A table is a spreadsheet. SELECT picks columns, WHERE keeps rows, ORDER BY sorts them."},
 {"h":"Joins","t":"JOIN combines rows from two tables where a key matches, e.g. orders.customer_id = customers.id."},
 {"h":"Aggregation","t":"GROUP BY collapses rows into groups; SUM, COUNT, AVG summarise each group. HAVING filters groups."},
 {"h":"Check yourself","t":"Why does WHERE not work on SUM(amount)? (Answer: WHERE runs before grouping; use HAVING.)"}],
 "sources":[{"title":"SQLite SELECT documentation","url":"https://www.sqlite.org/lang_select.html"},{"title":"PostgreSQL SELECT documentation","url":"https://www.postgresql.org/docs/current/sql-select.html"}]}

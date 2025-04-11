import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def connectDatabase():
    DATABASE_HOST = os.getenv("DATABASE_HOST")
    DATABASE_PORT = os.getenv("DATABASE_PORT")
    DATABASE_NAME = os.getenv("DATABASE_NAME")
    DATABASE_USER = os.getenv("DATABASE_USER")
    DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")

    try:
        connection = psycopg2.connect(
                host=DATABASE_HOST,
                port=DATABASE_PORT,
                database=DATABASE_NAME,
                user=DATABASE_USER,
                password=DATABASE_PASSWORD
        )
        print("Connection Successful!")
        return connection
    except psycopg2.Error as e:
        print(f"Error connecting to PostgreSQL: {e}")
        raise

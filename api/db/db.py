import os
import sqlite3
from sqlite3 import Error
from sys import stderr, exit

db_url = "test.db"

def create_table(connection, statement):
    """Given a SQL statement to execute, creates the specified table."""
    try:
        c = connection.cursor()
        c.execute(statement)
        c.close()
    except Exception as ex:
        print(ex, file=stderr)
        exit(1)

def db_initialize(db_url):
    os.remove(db_url) # delete the current existing test database.
    connection = sqlite3.connect(db_url)
    tables = [] # list of sql statements, each corresponding to tables to create in the database.

    # cards (the flashcards)
    tables.append(""" CREATE TABLE IF NOT EXISTS cards (
                                        id integer PRIMARY KEY,
                                        front text,
                                        back text,
                                        tag_id text
                                    ); """)

    # tags
    tables.append(""" CREATE TABLE IF NOT EXISTS tags (
                                        id integer PRIMARY KEY,
                                        name text
                                    ); """)

    for statement in tables:
        create_table(connection, statement)

    connection.close()

def db_connect(db_url):
    """Connect to a database given a database url.
    Returns a tuple (connection, cursor)."""
    try:
        connection = sqlite3.connect(db_url)
        cursor = connection.cursor()
        return (connection, cursor)
    except Exception as ex:
        print(ex, file=stderr)
        exit(1)

def db_disconnect(connection, cursor):
    """Given a connection and cursor, closes both links to the
    database."""
    try:
        cursor.close()
        connection.close()
    except Exception as ex:
        print(ex, file=stderr)
        exit(1)


def main():
    db_initialize(db_url)

    conn, cursor = db_connect(db_url)
    db_disconnect(conn, cursor)



if __name__ == '__main__':
    main()


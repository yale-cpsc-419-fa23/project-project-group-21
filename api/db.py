import os
import sqlite3
from sqlite3 import Error
from sys import stderr, exit

# Global variables
DB_URL = "test.db"

class Database:
    def __init__(self, db_url):
        self.card_id = 0
        self.tag_id = 0
        self.db_url = db_url
        self.db_initialize()

    def execute_statement(self, connection, statement, data=None):
        """Executes a given SQL statement. Data should be passed in
        when being used with prepared statements."""
        try:
            c = connection.cursor()
            if data is None:
                c.execute(statement)
            else:
                c.execute(statement, data)
            c.close()
        except Exception as ex:
            print(ex, file=stderr)
            exit(1)

    def db_initialize(self):
        # delete the current existing database if it exists. only for testing!
        try:
            os.remove(self.db_url)
        except OSError:
            pass

        connection = sqlite3.connect(self.db_url)
        tables = [] # list of sql statements, each corresponding to tables to create in the database.

        # cards (the flashcards)
        tables.append(""" CREATE TABLE IF NOT EXISTS cards (
                                            id integer PRIMARY KEY,
                                            front text,
                                            back text,
                                            tag_id integer
                                        ); """)

        # tags
        tables.append(""" CREATE TABLE IF NOT EXISTS tags (
                                            id integer PRIMARY KEY,
                                            name text
                                        ); """)

        for statement in tables:
            self.execute_statement(connection, statement)

        connection.close()

    def db_connect(self):
        """Connect to a database given a database url.
        Returns a tuple (connection, cursor)."""
        try:
            connection = sqlite3.connect(self.db_url)
            cursor = connection.cursor()
            return (connection, cursor)
        except Exception as ex:
            print(ex, file=stderr)
            exit(1)

    def db_disconnect(self, connection, cursor):
        """Given a connection and cursor, closes both links to the
        database."""
        try:
            cursor.close()
            connection.close()
        except Exception as ex:
            print(ex, file=stderr)
            exit(1)

    def add_card(self, front, back, tag_id):
        data = (self.card_id, front, back, tag_id)
        print(data)
        self.card_id += 1 # increment card_id after setting it to current card.
        statement = """INSERT INTO cards
                          (id, front, back, tag_id)
                          VALUES (?, ?, ?, ?);"""
        connection = sqlite3.connect(self.db_url)
        self.execute_statement(connection=connection,
                               statement=statement,
                               data=data)
        connection.commit()
        connection.close()

    def add_tag(self, name):
        data = (self.tag_id, name)
        print(data)
        self.tag_id += 1 # increment card_id after setting it to current card.
        statement = """INSERT INTO tags
                          (id, name)
                          VALUES (?, ?);"""
        connection = sqlite3.connect(self.db_url)
        self.execute_statement(connection=connection,
                               statement=statement,
                               data=data)
        connection.commit()
        connection.close()


def main():
    db = Database(DB_URL) # instantiates a database, and closes once

    # testing
    db.add_card("hello", "world", "10")
    db.add_card("this is", "pretty cool", "11")

    db.add_tag("tag0")
    db.add_tag("tag1")

if __name__ == '__main__':
    main()
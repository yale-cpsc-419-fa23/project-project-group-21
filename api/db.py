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
        # print(data)
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

    def edit_card(self, front, back, card_id, tag_id):
        data = (front, back, str(tag_id), str(card_id))
        statement = """UPDATE cards
                        SET front = ?,
                            back = ?,
                            tag_id = ?
                        WHERE id = ?"""
        connection = sqlite3.connect(self.db_url)
        self.execute_statement(connection=connection,
                               statement=statement,
                               data=data)
        connection.commit()
        connection.close()

    def add_tag(self, name):
        # ERROR: if inputting the tag reaches an error(executing) then the tag_id increases regardless
        # ERROR: put UNIQUE names
        data = (self.tag_id, name)
        # print(data)
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

    def update_tag(self, tag_id, card_id):
        data = (tag_id, card_id)
        statement = """UPDATE cards
                        SET tag_id = ?
                        WHERE id = ?"""
        connection = sqlite3.connect(self.db_url)
        self.execute_statement(connection=connection,
                               statement=statement,
                               data=data)
        connection.commit()
        connection.close()


    def retrieve_cards(self):
        statement = """SELECT cards.front, cards.back, cards.id, tags.name
                    FROM cards
                    LEFT JOIN tags ON cards.tag_id = tags.id
                    ORDER BY cards.front ASC"""
        connection, cursor = self.db_connect()
        cursor.execute(statement)
        return cursor.fetchall()

    def retrieve_card_by_id(self, card_id):
        statement = """SELECT cards.front, cards.back, cards.id, tags.name
                    FROM cards
                    LEFT JOIN tags ON cards.tag_id = tags.id
                    WHERE cards.id = ?"""
        connection, cursor = self.db_connect()
        cursor.execute(statement, (card_id,))
        return cursor.fetchall()

    def retrieve_cards_tag(self, tag):
        statement = """SELECT cards.front, cards.back, cards.id, tags.name
                    FROM cards
                    LEFT JOIN tags ON cards.tag_id = tags.id
                    WHERE tags.name = ?
                    ORDER BY cards.front ASC"""
        connection, cursor = self.db_connect()
        cursor.execute(statement, (tag,))
        return cursor.fetchall()

    def retrieve_tags(self):
        statement = """SELECT tags.name, tags.id
                    FROM tags
                    ORDER BY tags.name ASC"""
        connection, cursor = self.db_connect()
        cursor.execute(statement)
        return cursor.fetchall()

# for testing purposes only.
def main():
    from kanji import get_furigana

    db = Database(DB_URL) # instantiates a database, and closes once

    # testing
    db.add_card("へや会うくる", "へやあうくる", "0")
    db.add_card("教える", "おしえる", "0")
    db.add_card("会う", "あう", "0")
    db.add_card("お父さん", "おとうさん", "0")
    db.add_card("ご飯", "ごはん", "0")
    db.add_card("朝ご飯", "あさごはん", "0")

    db.add_tag("tag0")

    db.update_tag("1", "0")

    # print(db.retrieve_cards_tag("tag1"))

    ex = db.retrieve_card_by_id(0)[0]
    print(get_furigana(ex[0], ex[1]))

    ex = db.retrieve_card_by_id(1)[0]
    print(get_furigana(ex[0], ex[1]))

    ex = db.retrieve_card_by_id(2)[0]
    print(get_furigana(ex[0], ex[1]))

    ex = db.retrieve_card_by_id(3)[0]
    print(get_furigana(ex[0], ex[1]))

    ex = db.retrieve_card_by_id(4)[0]
    print(get_furigana(ex[0], ex[1]))

    ex = db.retrieve_card_by_id(5)[0]
    print(get_furigana(ex[0], ex[1]))

if __name__ == '__main__':
    main()
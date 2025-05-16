#!/bin/bash

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

# Create database if it doesn't exist
if ! psql -U postgres -lqt | cut -d \| -f 1 | grep -qw splitwise; then
    echo "Creating database splitwise..."
    createdb -U postgres splitwise
else
    echo "Database splitwise already exists"
fi

# Create user if it doesn't exist
if ! psql -U postgres -c "SELECT 1 FROM pg_roles WHERE rolname='postgres'" | grep -qw "1 row"; then
    echo "Creating user postgres..."
    createuser -U postgres -s postgres
fi

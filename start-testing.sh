#!/bin/bash

# SecondMarket - Quick Start Testing Script
# This script helps set up and start the testing environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   SecondMarket Testing Setup              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    lsof -i :"$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command_exists node; then
    echo -e "${RED}✗ Node.js is not installed${NC}"
    echo "  Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✓ Node.js is installed${NC}"

if ! command_exists mongod; then
    echo -e "${RED}✗ MongoDB is not installed${NC}"
    echo "  Install with: brew install mongodb-community"
    exit 1
fi
echo -e "${GREEN}✓ MongoDB is installed${NC}"

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo -e "${YELLOW}⚠ MongoDB is not running${NC}"
    echo "  Starting MongoDB..."
    brew services start mongodb-community 2>/dev/null || mongod --config /usr/local/etc/mongod.conf --fork
    sleep 2
    if pgrep -x "mongod" > /dev/null; then
        echo -e "${GREEN}✓ MongoDB started${NC}"
    else
        echo -e "${RED}✗ Failed to start MongoDB${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ MongoDB is running${NC}"
fi

# Check backend dependencies
echo ""
echo -e "${YELLOW}Checking backend dependencies...${NC}"
if [ ! -d "backend/node_modules" ]; then
    echo "  Installing backend dependencies..."
    cd backend && npm install && cd ..
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Backend dependencies already installed${NC}"
fi

# Check frontend dependencies
echo -e "${YELLOW}Checking frontend dependencies...${NC}"
if [ ! -d "frontend/node_modules" ]; then
    echo "  Installing frontend dependencies..."
    cd frontend && npm install && cd ..
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Frontend dependencies already installed${NC}"
fi

# Check if .env files exist
echo ""
echo -e "${YELLOW}Checking configuration files...${NC}"
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠ backend/.env not found, copying from .env.example${NC}"
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✓ Created backend/.env${NC}"
else
    echo -e "${GREEN}✓ backend/.env exists${NC}"
fi

if [ ! -f "frontend/.env" ]; then
    echo -e "${YELLOW}⚠ frontend/.env not found, creating...${NC}"
    echo "REACT_APP_API_URL=http://localhost:5000/api" > frontend/.env
    echo -e "${GREEN}✓ Created frontend/.env${NC}"
else
    echo -e "${GREEN}✓ frontend/.env exists${NC}"
fi

# Seed database
echo ""
echo -e "${YELLOW}Seeding database with Mexican states and municipalities...${NC}"
cd backend
node scripts/seedMexico.js
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database seeded successfully${NC}"
else
    echo -e "${RED}✗ Failed to seed database${NC}"
    echo "  Make sure MongoDB is running and accessible"
    cd ..
    exit 1
fi
cd ..

# Check if ports are available
echo ""
echo -e "${YELLOW}Checking ports...${NC}"
if port_in_use 5000; then
    echo -e "${YELLOW}⚠ Port 5000 is already in use${NC}"
    echo "  Backend might already be running, or another process is using the port"
else
    echo -e "${GREEN}✓ Port 5000 is available${NC}"
fi

if port_in_use 3000; then
    echo -e "${YELLOW}⚠ Port 3000 is already in use${NC}"
    echo "  Frontend might already be running, or another process is using the port"
else
    echo -e "${GREEN}✓ Port 3000 is available${NC}"
fi

# Display next steps
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Setup Complete!                         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo ""
echo -e "${YELLOW}1. Start the backend server:${NC}"
echo "   cd backend && npm start"
echo ""
echo -e "${YELLOW}2. In a new terminal, start the frontend:${NC}"
echo "   cd frontend && npm start"
echo ""
echo -e "${YELLOW}3. Run automated API tests:${NC}"
echo "   node backend/test-api.js"
echo ""
echo -e "${YELLOW}4. Follow manual testing checklist:${NC}"
echo "   Open TESTING_CHECKLIST.md"
echo ""
echo -e "${BLUE}Testing Resources:${NC}"
echo "  • TESTING_CHECKLIST.md - Comprehensive manual testing guide"
echo "  • VALIDATION_REPORT.md - Implementation status and validation approach"
echo "  • backend/test-api.js - Automated API testing script"
echo ""
echo -e "${GREEN}Happy testing! 🚀${NC}"

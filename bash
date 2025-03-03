#!/bin/bash

# Detect the operating system
case "$(uname -s)" in
    Linux*|Darwin*)
        echo "Mac/Linux detected. Running Unix setup..."
        
        # Check out dev branch
        echo "Checking out dev branch..."
        git checkout dev
        
        # Create virtual environment
        echo "Creating Python virtual environment..."
        python3 -m venv venv
        
        # Activate virtual environment
        echo "Activating virtual environment..."
        source venv/bin/activate
        
        # Install dependencies
        echo "Installing npm dependencies..."
        npm install
        
        # Ask to start server
        echo "Do you want to start the development server now? (y/n)"
        read -r response
        if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            echo "Starting development server..."
            npm run dev
        else
            echo "Setup complete!"
            echo "To start the development server, run: npm run dev"
            echo "To deactivate the virtual environment, run: deactivate"
        fi
        ;;
        
    MINGW*|MSYS*|CYGWIN*|Windows*)
        echo "Windows detected. Running Windows setup..."
        
        # Check out dev branch
        echo "Checking out dev branch..."
        git checkout dev
        
        # Create virtual environment
        echo "Creating Python virtual environment..."
        python -m venv venv
        
        # Activate virtual environment
        echo "Activating virtual environment..."
        . venv/Scripts/activate
        
        # Install dependencies
        echo "Installing npm dependencies..."
        npm install
        
        # Note about env variables
        echo "NOTE: You will need to set up your environment variables manually."
        echo "Please check the .env.example file and create a .env file with your values."
        
        # Ask to start server
        echo "Do you want to start the development server now? (y/n)"
        read -r response
        if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            echo "Starting development server..."
            npm run dev
        else
            echo "Setup complete!"
            echo "To start the development server, run: npm run dev"
            echo "To deactivate the virtual environment, run: deactivate"
        fi
        ;;
        
    *)
        echo "Unknown operating system. Please use setup.sh (for Mac/Linux) or setup.bat (for Windows)."
        exit 1
        ;;
esac

#!/bin/bash

# Detect the operating system
case "$(uname -s)" in
    Linux*|Darwin*)
        echo "Mac/Linux detected. Running Unix setup..."

        # Create virtual environment
        echo "Creating Python virtual environment..."
        python3 -m venv venv
        
        # Activate virtual environment
        echo "Activating virtual environment..."
        source venv/bin/activate
        
        # Install dependencies
        echo "Installing npm dependencies..."
        npm install
        
        # Ask to start server
        echo "Do you want to start the development server now? (y/n)"
        read -r response
        if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            echo "Starting development server..."
            npm run dev
        else
            echo "Setup complete!"
            echo "To start the development server, run: npm run dev"
            echo "To deactivate the virtual environment, run: deactivate"
        fi
        ;;
        
    MINGW*|MSYS*|CYGWIN*|Windows*)
        echo "Windows detected. Running Windows setup..."
        
        # Create virtual environment
        echo "Creating Python virtual environment..."
        python -m venv venv
        
        # Activate virtual environment
        echo "Activating virtual environment..."
        . venv/Scripts/activate
        
        # Install dependencies
        echo "Installing npm dependencies..."
        npm install

        # Ask to start server
        echo "Do you want to start the development server now? (y/n)"
        read -r response
        if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            echo "Starting development server..."
            npm run dev
        else
            echo "Setup complete!"
            echo "To start the development server, run: npm run dev"
            echo "To deactivate the virtual environment, run: deactivate"
        fi
        ;;
        
    *)
        echo "Unknown operating system. Please use setup.sh (for Mac/Linux) or setup.bat (for Windows)."
        exit 1
        ;;
esac

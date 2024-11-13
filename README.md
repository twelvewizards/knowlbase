# Prerequisites
1. Install Python
2. Install Git
3. Install PostgreSQL: Download and install PostgreSQL if it's not already installed.
4. Add PostgreSQL to PATH: Ensure PostgreSQL's bin folder (e.g., C:\Program Files\PostgreSQL\<version>\bin) is in your system's PATH so you can use the psql command. (IMPORTANT!!)


# Step-by-Step Setup Instructions

**Step 1: Set Up the Database**
1. Create Database in pgAdmin:
- Open pgAdmin and connect to your PostgreSQL server.
- Go to Object > Create > Database.
- Name the database KnowlBase (CASE-SENSITIVE!!).
- Click Save.
  
2. Import Database from SQL File:
- Download the knowlbase.sql file. https://drive.google.com/file/d/1upt8Q6dp-hMZSwPp7V2rXxlm_er7jMdW/view?usp=sharing
- Open Command Prompt and use the following command to import the data: psql -U postgres -h localhost -d KnowlBase -f "C:/path/to/KnowlBase.sql"
Replace C:/path/to/KnowlBase.sql with the actual path to the downloaded knowlbase.sql file.
This command will populate the KnowlBase database with initial data.


**Step 2: Clone the Repository**
1. Clone the Project: git clone https://github.com/twelvewizards/knowlbase
2. Navigate into the project directory: cd knowlbase


**Step 3: Set Up the Virtual Environment**
1. Create a Virtual Environment: python -m venv ~env
2. Activate: ~env/Scripts then ./activate or activate.ps1
   ~env is the name of your venv it doesn't need to be "~env" it can be anything just add it to the gitignore

   
**Step 4: Install Project Dependencies**
1. Install Dependencies: pip install -r requirements.txt


**Step 5: Run the Development Server**
1. Start the server: python manage.py runserver

**Step 6: Version Control Workflow**

- Creating or Navigating to a Branch
   Create a New Branch: git checkout -b new_branch_name
   Switch to existing branch: git checkout branch_name

- Commiting Changes
  Add Changes: git add .
  Commit Changes: -m "your commit message"

- Pushing Changes
  Push Changes to Remote: git push -u origin new_branch_name

- Additional Git Commands
  To switch branches: git checkout main  # switch to main branch
                      git pull origin main  # pull the latest changes from the repository
                      git checkout branch_name  # switch to your branch
                      git merge main  # merge latest changes from main into your branch

git merge main  # merge latest changes from main into your branch


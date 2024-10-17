# Step 1: Create and activate a virtual environment
python -m venv ~env
cd ~env/Scripts || cd ~env/bin  # Windows || Mac/Linux
./activate
cd ../..


# Step 2: Clone the repository
git clone https://github.com/twelvewizards/knowlbase


# Step 3: Install required dependances 
pip install =r requirements.txt


# Step 4: Start server
python manage.py runserver


# Step 5: Create a new branch or Navigate to existing branch
git checkout -b 'new_branch_name' || git checkout 'branch_name'


# Step 6: Add and commit your changes
git add .
git commit -m "your commit message"

# Step 7: Push the changes to the remote repository
git push -u origin 'new_branch_name'

# To switch branches
git checkout main (switch to main branch)
git pull origin main (pull the latest changes from repo)
git checkout 'branch name' (switch to said branch)
git merge main (merges latest changes from main into branch) 

# berytech-boilerplate-express
 A tiny web application that aims to interact with slack to automate some tasks on slackworkspace like:
 * invite users to slackworkspace.
 * create usergroups directly in slackworkspace.
 the application scope now is to create usergroups into workspace:
 How it works?
 1. admin can upload an excel file composed mainly of :
   -user first-name
   -user last-name
   -user team-name
   -action needed to perform by admin.(add user, delete user)
 2. once the file uploaded, the application will create the usergroups(team-name) into slackworkspace.

# Setting
# Environment Variables
You should set environment variables directly or in .env file


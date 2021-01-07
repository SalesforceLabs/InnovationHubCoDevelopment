# Create scratch org with 30 day duration
sfdx force:org:create -f config/project-scratch-def.json -d 30 -s

# Push source to scratch org (includes test community)
sfdx force:source:push

# Experience bundle deploy workaround - API 47 disable forceignore
mv .forceignore forceignoreplaceholder

# Assign permission set
sfdx force:user:permset:assign -n Innovation_Hub_Admin

# generating sample data
sfdx force:apex:execute -f scripts/apex/generateSampleIdeas.apex 
sfdx force:apex:execute -f scripts/apex/generateSampleInspirations.apex 
sfdx force:apex:execute -f scripts/apex/generateSampleDemos.apex 
sfdx force:apex:execute -f scripts/apex/generateSampleEvents.apex 
sfdx force:data:tree:import --plan sample-data/sample-data-innohub__Challenge__c-plan.json

# Deploy Experience Bundle (Community) and give .forceignore correct name
sfdx force:source:deploy -x manifest/package.xml
mv forceignoreplaceholder .forceignore

# open scratch org
sfdx force:org:open

# generate password
sfdx force:user:password:generate
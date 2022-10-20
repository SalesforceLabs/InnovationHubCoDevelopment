sfdx force:apex:execute -f scripts/apex/reset.apex 

sfdx force:apex:execute -f scripts/apex/generateSampleIdeas.apex
sfdx force:apex:execute -f scripts/apex/generateSampleInspirations.apex 
sfdx force:apex:execute -f scripts/apex/generateSampleDemos.apex 
sfdx force:apex:execute -f scripts/apex/generateSampleEvents.apex 
sfdx force:data:tree:import --plan sample-data/sample-data-innohub__Challenge__c-plan.json
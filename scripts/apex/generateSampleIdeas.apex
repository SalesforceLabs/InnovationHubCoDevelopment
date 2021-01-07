// Use .apex files to store anonymous Apex.
// You can execute anonymous Apex in VS Code by selecting the
//     apex text and running the command:
//     SFDX: Execute Anonymous Apex with Currently Selected Text
// You can also execute the entire file by running the command:
//     SFDX: Execute Anonymous Apex with Editor Contents

// Generate Ideas
List<innohub__Innovation_Idea__c> ideas = new List<innohub__Innovation_Idea__c>();
RecordType ideaRecordType = [SELECT Id, Name FROM RecordType WHERE sObjectType = 'innohub__Innovation_Idea__c' AND Name = 'Idea' Limit 1];
RecordType erRecordType = [SELECT Id, Name FROM RecordType WHERE sObjectType = 'innohub__Innovation_Idea__c' AND Name = 'Evolution Request' Limit 1];
for(integer i = 50; i< 2050; i++){
    // Add some randomness
    Integer randomInt = Integer.valueOf((Math.random() * 10));

    // Creating the idea
    innohub__Innovation_Idea__c idea = new innohub__Innovation_Idea__c();
    idea.Name = 'Amazing Idea ' + i;
    idea.innohub__Department__c = 'Idea Factory';
    idea.innohub__Describe_your_evolution__c = 'The best idea ever had. The very best. Pretty too. There\'s a lot that can be said about this idea, but I won\'t say it. That would be a waste of time. Just know it\'s amazing. A better idea has never been had.';
    idea.innohub__Overview__c = 'This is a fabulous idea. So great!';

    if (randomInt < 3) {
        idea.innohub__Approval_Status__c = 'Approved';
        idea.innohub__Category__c = 'Value 1;Value 2';
        idea.innohub__Recommended__c = true;
        idea.innohub__Stage__c = 'Stage1';
        idea.innohub__Type__c = 'New Functionality';
        idea.RecordTypeId = ideaRecordType.Id;
    } else if (randomInt < 6) {
        idea.innohub__Approval_Status__c = 'Approved';
        idea.innohub__Category__c = 'Value 3;Value 4';
        idea.innohub__Recommended__c = false;
        idea.innohub__Stage__c = 'Stage2';
        idea.innohub__Type__c = 'Enhance Existing Functionality';
        idea.RecordTypeId = erRecordType.Id;
    } else if (randomInt < 10) {
        idea.innohub__Approval_Status__c = 'Submitted';
        idea.innohub__Category__c = 'Value 1;Value 4';
        idea.innohub__Recommended__c = false;
        idea.innohub__Stage__c = 'Stage1';
        idea.innohub__Type__c = 'New Functionality';
        idea.RecordTypeId = ideaRecordType.Id;
    }
    ideas.add(idea);
}
insert ideas;

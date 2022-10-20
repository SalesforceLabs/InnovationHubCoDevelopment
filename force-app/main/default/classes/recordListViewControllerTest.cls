@isTest
global with sharing class recordListViewControllerTest {
    global static testMethod void testGetRecordCount(){
        innohub__Innovation_Idea__c myIdea = new innohub__Innovation_Idea__c();
        myIdea.Name = 'Test';
        myIdea.innohub__Stage__c = 'Stage1';
        insert myIdea;

        innohub__Innovation_Idea_Vote__c ihv1 = new innohub__Innovation_Idea_Vote__c();
        ihv1.innohub__Innovation_Idea__c = myIdea.Id;
        ihv1.innohub__Vote_Type__c = true;
        insert ihv1;

        //String objApiName, String lookupField, String contextId, String filters,sortBy,show,rtyp ,votesObject,voteObjectLookup, String userType, String approvalCondition) {  
        Integer recordCount = recordListViewController.getRecordCount('innohub__Innovation_Idea__c', null, null, '{"innohub__Stage__c":"Stage1"}', null, 'liked', null, 'innohub__Innovation_Idea_Vote__c', 'innohub__Innovation_Idea__c', 'Creator', null, 'innohub__Vote_Type__c');
        System.assertEquals(recordCount, 1);
    }

    global static testMethod void testGetRecords(){
        innohub__Innovation_Idea__c myIdea = new innohub__Innovation_Idea__c();
        myIdea.Name = 'Test1';
        myIdea.innohub__Stage__c = 'Stage1';
        insert myIdea;

        innohub__Innovation_Idea__c myIdea2 = new innohub__Innovation_Idea__c();
        myIdea2.Name = 'Test2';
        myIdea2.innohub__Stage__c = 'Stage1';
        insert myIdea2;

        innohub__Innovation_Idea_Vote__c ihv1 = new innohub__Innovation_Idea_Vote__c();
        ihv1.innohub__Innovation_Idea__c = myIdea.Id;
        ihv1.innohub__Vote_Type__c = true;
        insert ihv1;

        innohub__Innovation_Idea_Vote__c ihv2 = new innohub__Innovation_Idea_Vote__c();
        ihv2.innohub__Innovation_Idea__c = myIdea2.Id;
        ihv2.innohub__Vote_Type__c = true;
        insert ihv2;

                                                                    //String objApiName,            fields, String voteField,        voteRecordRelationship,             votesObject,                         voteObjectLookup,          lookupField, contextId, pageSize, page, usePagination, String filters, String sortBy, String show, String recordTypeId, String name, String points, String recommended, String userType, String approvalCondition) {    
        List<SObject> records = recordListViewController.getRecords('innohub__Innovation_Idea__c', 'Name', 'innohub__Vote_Type__c', 'innohub__Innovation_Idea_Votes__r', 'innohub__Innovation_Idea_Vote__c', 'innohub__Innovation_Idea__c', null, null, 3, 1, true, '{"innohub__Stage__c":"Stage1"}', 'oldest', 'liked', null, 'Name', null, 'innohub__Recommended__c', 'Creator', null);
        System.assertEquals(records.size(), 2);

        List<SObject> records2 = recordListViewController.getRecords('innohub__Innovation_Idea__c', 'Name', 'innohub__Vote_Type__c', 'innohub__Innovation_Idea_Votes__r', 'innohub__Innovation_Idea_Vote__c', 'innohub__Innovation_Idea__c', null, null, 3, 1, true, '{"innohub__Stage__c":"Stage1"}', 'popular', 'mySubmissions', null, 'Name', 'innohub__Points__c', null, 'Owner', null);
        System.assertEquals(records2.size(), 2);

    }

    global static testMethod void testVote(){
        innohub__Innovation_Idea__c myIdea = new innohub__Innovation_Idea__c();
        myIdea.Name = 'Test1';
        insert myIdea;

        recordListViewController.vote(myIdea.id, 'innohub__Innovation_Idea_Vote__c', 'innohub__Vote_Type__c', true, 'innohub__Innovation_Idea__c');

        List<innohub__Innovation_Idea_Vote__c> vote = [SELECT Id FROM innohub__Innovation_Idea_Vote__c WHERE CreatedById =: userInfo.getUserId() AND innohub__Vote_Type__c = true AND innohub__Innovation_Idea__c =: myIdea.Id];
        System.assertEquals(vote.size(), 1);

        recordListViewController.vote(myIdea.id, 'innohub__Innovation_Idea_Vote__c', 'innohub__Vote_Type__c', false, 'innohub__Innovation_Idea__c');

        List<innohub__Innovation_Idea_Vote__c> votesAfterUnvote = [SELECT Id FROM innohub__Innovation_Idea_Vote__c WHERE CreatedById =: userInfo.getUserId() AND innohub__Vote_Type__c = true AND innohub__Innovation_Idea__c =: myIdea.Id];
        System.assertEquals(votesAfterUnvote.size(), 0);


    }

}
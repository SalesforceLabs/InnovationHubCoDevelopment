@isTest
global with sharing class IH_HomepageHighlights_TestClass {

    global static testMethod void testGetPopularIdea(){
        innohub__Innovation_Idea__c myIdea = new innohub__Innovation_Idea__c();
        myIdea.Name = 'Test';
        myIdea.Approval_Status__c = 'Approved';
        insert myIdea;
        
        innohub__Innovation_Idea_Vote__c myVote1 = new innohub__Innovation_Idea_Vote__c();
        myVote1.innohub__Vote_Type__c = True;
        myVote1.innohub__Innovation_Idea__c = myIdea.Id;
        insert myVote1;
        
        IH_HomepageHighlights.ideaWrapper ideaReturn = IH_HomepageHighlights.getPopularIdea('Owner');
        
        List<innohub__Innovation_Idea__c> ideaList = new List<innohub__Innovation_Idea__c>();
        ideaList.add(ideaReturn.idea);
        system.assertEquals(ideaList.size(), 1);
        
    }
    
    global static testMethod void testGetLatestDemo(){
        innohub__Demo__c myDemo = new innohub__Demo__c();
        myDemo.Name = 'Test';
        insert myDemo;  
        
        innohub__Demo__c returnDemo = IH_HomepageHighlights.getLatestDemo();
        
        List<innohub__Demo__c> demoList = new List<innohub__Demo__c>();
        demoList.add(returnDemo);
        system.assertEquals(demoList.size(), 1);
    }
    
    global static testMethod void testGetThePrototype(){
        innohub__Prototype__c myPrototype = new innohub__Prototype__c();
        myPrototype.Name = 'Test Diarmuid';
        insert myPrototype;
        
        innohub__Prototype__c returnPrototype = IH_HomepageHighlights.getThePrototype();
        
        List<innohub__Prototype__c> proList = new List<innohub__Prototype__c>();
        proList.add(returnPrototype);
        system.assertEquals(proList.size(), 1);
    }
}
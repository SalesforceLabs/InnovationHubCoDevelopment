@isTest
public with sharing class listViewCtr_TestClass {

    public static testMethod void getList(){
        innohub__Innovation_Idea__c myIdea = new innohub__Innovation_Idea__c();
        myIdea.Name = 'Test';
        insert myIdea;
        
        innohub__Demo__c myDemo = new innohub__Demo__c();
        myDemo.Name = 'Test';
        myDemo.innohub__demo_type__c = 'Type 1';
        myDemo.innohub__Clouds_Involved__c  = 'Value 1';
        myDemo.innohub__Category__c  = 'Value 1';
        insert myDemo;
        
        innohub__Innovation_Demo_Association__c myInnDemo = new innohub__Innovation_Demo_Association__c();
        myInnDemo.innohub__Demo__c = myDemo.Id;
        myInnDemo.innohub__Innovation__c = myIdea.Id;
        insert myInnDemo;
        
        List<innohub__Innovation_Demo_Association__c> myInnDemoList = listViewCtr.getList(myIdea.Id, 'innohub__Innovation__r', 'innohub__Innovation_Demo_Association__c');
        
    }
}
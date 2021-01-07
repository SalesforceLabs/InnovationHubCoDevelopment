@isTest
public with sharing class IH_ArticleController_Test {
    public static testMethod void testGetArticles(){
        innohub__Event__c myEvent = new innohub__Event__c();
        myEvent.Name = 'Test';
        myEvent.innohub__Agenda__c = 'The Agenda';
        myEvent.innohub__Start__c = Datetime.newInstance(2018, 06, 13);
        myEvent.innohub__End__c = Datetime.newInstance(2018, 06, 14);
        myEvent.innohub__Contact__c = 'Diarmuid Dunne';
        myEvent.innohub__Venue__c = 'RDS Dublin';
        myEvent.innohub__Active__c = true;
        insert myEvent;
        
        List<innohub__Event__c> theCampaigns = IH_ArticleController.getArticles();
        
        system.assertEquals(theCampaigns.size(), 1);
    }
}
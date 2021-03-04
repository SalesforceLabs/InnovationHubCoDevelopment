@isTest
public with sharing class UserInfoControllerTest {

    @testSetup static void setup() {
        innohub__Innovation_Idea__c myIdea = new innohub__Innovation_Idea__c();
        myIdea.Name = 'Test';
        myIdea.innohub__Stage__c = 'Stage1';
        insert myIdea;
    }

    @isTest static void getUserInfoTest() {
        innohub__Innovation_Idea__c myIdea = [SELECT  Id, CreatedBy.Name,Owner.Name,Name FROM innohub__Innovation_Idea__c WHERE Name = 'Test'];

        sObject myIdeaCreator = UserInfoController.getUserInfo('innohub__Innovation_Idea__c', 'Creator', myIdea.Id) ;
        sObject myIdeaOwner = UserInfoController.getUserInfo('innohub__Innovation_Idea__c', 'Owner', myIdea.Id) ;

        System.assertEquals(myIdea.CreatedById,myIdeaCreator.get('CreatedById'), 'Names dont Match');
        System.assertEquals(myIdea.OwnerId,myIdeaOwner.get('OwnerId') , 'Names dont Match');

    }
    @isTest static void getUserInfoTestNegative() {
        innohub__Innovation_Idea__c myIdea = [SELECT  Id, CreatedBy.Name,Owner.Name,Name FROM innohub__Innovation_Idea__c WHERE Name = 'Test'];

        try{
            UserInfoController.getUserInfo( 'innohub__Innovation_Idea__c', 'cat', myIdea.Id) ;
        } catch(Exception e){
            System.assertNotEquals(e.getMessage(), null , 'Unexpected exception message thrown');
        }
    }
}


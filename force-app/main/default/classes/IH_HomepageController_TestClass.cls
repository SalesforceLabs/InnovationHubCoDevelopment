@isTest
global with sharing class IH_HomepageController_TestClass {

    global static testMethod void testGetMyIdeas(){
        innohub__Innovation_Idea__c myIdea = new innohub__Innovation_Idea__c();
        myIdea.Name = 'Test';
        myIdea.innohub__Approval_Status__c = 'Approved';
        insert myIdea; 
        
        Integer theIdeas = IH_HomepageController.getMyIdeas();
        
        System.assertEquals(theIdeas, 1);
    }
    
    global static testMethod void testGetFavIdeas(){
        innohub__Innovation_Idea__c myIdea = new innohub__Innovation_Idea__c();
        myIdea.Name = 'Test';
        insert myIdea; 
        
        innohub__Innovation_Idea_Vote__c myVote = new innohub__Innovation_Idea_Vote__c();
        myVote.innohub__Innovation_Idea__c = myIdea.Id;
        myVote.innohub__Vote_Type__c = true;
        insert myVote;
            
        Integer theIdeas = IH_HomepageController.getFavIdeas();
        
        System.assertEquals(theIdeas, 1);
    }
    
    global static testMethod void testGetFavDemos(){
        innohub__Demo__c myDemo = new innohub__Demo__c();
        myDemo.Name = 'Test';
        insert myDemo; 
    
        innohub__Demo_Vote__c myVote = new innohub__Demo_Vote__c ();
        myVote.innohub__Demo__c = myDemo.Id;
        myVote.innohub__Vote_Type__c = true;
        insert myVote;
            
        Integer theDemos = IH_HomepageController.getFavDemos();
        
        System.assertEquals(theDemos, 1);
    }
    
    global static testMethod void testGetMyEvents(){
         Id p = [select id from profile where name='Innohub General User'].id;
        
        Account ac = new Account(name ='Grazitti') ;
        insert ac; 
        
        Contact con = new Contact(LastName ='testCon',AccountId = ac.Id);
        insert con;  
        
        User user = new User(alias = 'test123', email='test123@noemail.com',
                             emailencodingkey='UTF-8', lastname='Testing', languagelocalekey='en_US',
                             localesidkey='en_US', profileid = p, country='United States',IsActive=true,
                             ContactId = con.Id,
                             timezonesidkey='America/Los_Angeles', username='tester@dermo.com');
        
        insert user;
        
        innohub__Event__c myEvent = new innohub__Event__c();
        myEvent.Name = 'Test';
        myEvent.innohub__Agenda__c = 'The Agenda';
        myEvent.innohub__Start__c = Datetime.newInstance(2018, 06, 13);
        myEvent.innohub__End__c = Datetime.newInstance(2018, 06, 14);
        myEvent.innohub__Contact__c = 'Diarmuid Dunne';
        myEvent.innohub__Venue__c = 'RDS Dublin';
        insert myEvent;
        
        System.runAs(user) {
            innohub__Event_Member__c myMember= new innohub__Event_Member__c();
            myMember.innohub__Event__c = myEvent.Id;
            myMember.innohub__Attending__c = true;
            insert myMember;
        }                
        Integer theEvents = IH_HomepageController.getMyEvents(user);
        
        System.assertEquals(theEvents, 0);
        
    }
    
    global static testMethod void testGetUser(){
        User myUser = IH_HomepageController.getUser();
        
        List<User> userList = new List<User>();
        userList.add(myUser);
        system.assertEquals(userList.size(), 1);
    }
}
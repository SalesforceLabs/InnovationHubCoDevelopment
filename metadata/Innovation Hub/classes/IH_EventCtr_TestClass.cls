@isTest
public with sharing class IH_EventCtr_TestClass {
    public static testMethod void testCreateCampaignMember(){
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
        myEvent.innohub__Description__c = 'The Description';
        myEvent.innohub__Agenda__c = 'The Agenda';
        myEvent.innohub__Start__c = Datetime.newInstance(2018, 06, 13);
        myEvent.innohub__End__c = Datetime.newInstance(2018, 06, 14);
        myEvent.innohub__Contact__c = 'Diarmuid Dunne';
        myEvent.innohub__Venue__c = 'RDS Dublin';
        
        insert myEvent;
        
        
        innohub__Event_Member__c myMember = IH_EventCtr.createEventMember(myEvent, user);
        
        List<innohub__Event_Member__c> memberList = new List<innohub__Event_Member__c>();
        memberList.add(myMember);
        system.assertEquals(memberList.size(), 1);
    } 
    
    public static testMethod void testRemoveCampaignMember(){
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
        myEvent.innohub__Description__c = 'The Description';
        myEvent.innohub__Agenda__c = 'The Agenda';
        myEvent.innohub__Start__c = Datetime.newInstance(2018, 06, 13);
        myEvent.innohub__End__c = Datetime.newInstance(2018, 06, 14);
        myEvent.innohub__Contact__c = 'Diarmuid Dunne';
        myEvent.innohub__Venue__c = 'RDS Dublin';
        insert myEvent;
        
        innohub__Event_Member__c myMember= new innohub__Event_Member__c();
        myMember.innohub__Event__c = myEvent.Id;
        myMember.innohub__Attending__c = true;
        insert myMember;
        
        innohub__Event_Member__c myMemberInserted = IH_EventCtr.removeEventMember(myEvent);
        
        List<innohub__Event_Member__c> memberList = new List<innohub__Event_Member__c>();
        memberList.add(myMemberInserted);
        system.assertEquals(memberList.size(), 1);
    }
    
    
    public static testMethod void testCheckIfCampaignMember(){
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
       	myEvent.innohub__Description__c = 'The Description';
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
        innohub__Event_Member__c myMemberInserted = IH_EventCtr.checkIfEventMember(myEvent, user);
        
        List<innohub__Event_Member__c> memberList = new List<innohub__Event_Member__c>();
        memberList.add(myMemberInserted);
        system.assertEquals(memberList.size(), 1);
    }
    
    
    public static testMethod void testGetCampaignes(){
        Campaign nyCmpaign = new Campaign();
        nyCmpaign.Name = 'Test';
        nyCmpaign.innohub__Country__c = 'Location 1';
        nyCmpaign.innohub__Campaign_Type__c = 'Type 1';
        insert nyCmpaign;  
        
        innohub__Event__c myEvent = new innohub__Event__c();
        myEvent.Name = 'Test';
        myEvent.innohub__Description__c = 'The Description';
        myEvent.innohub__Agenda__c = 'The Agenda';
        myEvent.innohub__Start__c = Datetime.newInstance(2018, 06, 13);
        myEvent.innohub__End__c = Datetime.newInstance(2018, 06, 14);
        myEvent.innohub__Contact__c = 'Diarmuid Dunne';
        myEvent.innohub__Venue__c = 'RDS Dublin';
        myEvent.innohub__Location__c = 'Location 1';
        insert myEvent;
        
        //Type All Events
        String selectedFilter = 'Type';
        String searchFiltersJSON = '[{"filterName":"Type","selectedFilters":["\'All Events\'"]}]';
        
        List<innohub__Event__c> theCampaigns = IH_EventCtr.getCampaignes(selectedFilter, searchFiltersJSON);
        system.assertEquals(theCampaigns.size(), 0);
        
        //Location Paris
        String selectedFilter_1 = 'Location';
        String searchFiltersJSON_1 = '[{"filterName":"Location","selectedFilters":["\'Location 1\'"]}]';
        
        List<innohub__Event__c> theCampaigns_1 = IH_EventCtr.getCampaignes(selectedFilter_1, searchFiltersJSON_1);
        system.assertEquals(theCampaigns_1.size(), 0);
        
        //Session Types Demo
        String selectedFilter_2 = 'Session Types';
        String searchFiltersJSON_2 = '[{"filterName":"Session Types","selectedFilters":["\'Demo\'"]}]';
        
        List<innohub__Event__c> theCampaigns_2 = IH_EventCtr.getCampaignes(selectedFilter_2, searchFiltersJSON_2);
        system.assertEquals(theCampaigns_2.size(), 0);
        
        //Date This Week
        String selectedFilter_3 = 'Date';
        String searchFiltersJSON_3 = '[{"filterName":"Date","selectedFilters":["\'This Week\'"]}]';
        
        List<innohub__Event__c> theCampaigns_3 = IH_EventCtr.getCampaignes(selectedFilter_3, searchFiltersJSON_3);
        system.assertEquals(theCampaigns_3.size(), 0);    
        
        //Date This Month
        String selectedFilter_4 = 'Date';
        String searchFiltersJSON_4 = '[{"filterName":"Date","selectedFilters":["\'This Month\'"]}]';
        
        List<innohub__Event__c> theCampaigns_4 = IH_EventCtr.getCampaignes(selectedFilter_4, searchFiltersJSON_4);
        system.assertEquals(theCampaigns_4.size(), 0);  
        
        //Date This Quarter
        String selectedFilter_5 = 'Date';
        String searchFiltersJSON_5 = '[{"filterName":"Date","selectedFilters":["\'This Quarter\'"]}]';
        
        List<innohub__Event__c> theCampaigns_5 = IH_EventCtr.getCampaignes(selectedFilter_5, searchFiltersJSON_5);
        system.assertEquals(theCampaigns_5.size(), 0);  
    }
    
    public static testMethod void testGetCreator(){
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
        
        User theUser = IH_EventCtr.getCreator(user.Id);
        
        List<User> userList = new List<User>();
        userList.add(theUser);
        system.assertEquals(userList.size(), 1);
    }
    
    public static testMethod void testGetCampaign(){
        innohub__Event__c myEvent = new innohub__Event__c();
        myEvent.Name = 'Test';
        myEvent.innohub__Description__c = 'The Description';
        myEvent.innohub__Agenda__c = 'The Agenda';
        myEvent.innohub__Start__c = Datetime.newInstance(2018, 06, 13);
        myEvent.innohub__End__c = Datetime.newInstance(2018, 06, 14);
        myEvent.innohub__Contact__c = 'Diarmuid Dunne';
        myEvent.innohub__Venue__c = 'RDS Dublin';
        myEvent.innohub__Location__c = 'Location 1';
        insert myEvent;
        
        innohub__Event__c theCampaigns = IH_EventCtr.getEvent(myEvent.Id);
        
        List<innohub__Event__c> campaignList = new List<innohub__Event__c>();
        campaignList.add(theCampaigns);
        system.assertEquals(campaignList.size(), 1);
    }
    
    public static testMethod void testCheckAvailability(){
        innohub__Event__c myEvent = new innohub__Event__c();
        myEvent.Name = 'Test';
        myEvent.innohub__Description__c = 'The Description';
        myEvent.innohub__Agenda__c = 'The Agenda';
        myEvent.innohub__Start__c = Datetime.newInstance(2018, 06, 13);
        myEvent.innohub__End__c = Datetime.newInstance(2018, 06, 14);
        myEvent.innohub__Contact__c = 'Diarmuid Dunne';
        myEvent.innohub__Venue__c = 'RDS Dublin';
        myEvent.innohub__Location__c = 'Location 1';
        myEvent.innohub__Registration_Open__c = true;
        insert myEvent;
        
        innohub__Event__c theCampaigns = IH_EventCtr.checkAvailability(myEvent.Id);
        
        List<innohub__Event__c> campaignList = new List<innohub__Event__c>();
        campaignList.add(theCampaigns);
        system.assertEquals(campaignList.size(), 1);
    }
    public static testMethod void testGetPicklistValues(){
        List<String> myPicks = IH_EventCtr.getPicklistValues('innohub__Type__c');
        
        System.assertEquals(myPicks.size(), 5);
    }
    
    public static testMethod void testGetPicklistLabel(){
        String myLabel = IH_EventCtr.getPicklistLabel('innohub__Type__c');
        
        System.assertEquals(myLabel, 'Session Type');
    }
}
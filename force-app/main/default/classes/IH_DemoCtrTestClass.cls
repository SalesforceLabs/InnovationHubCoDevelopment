@isTest
global with sharing class IH_DemoCtrTestClass {
    
    global static testMethod void testGetDemos(){
        innohub__Demo__c myDemo = new innohub__Demo__c();
        myDemo.Name = 'Test';
        myDemo.innohub__demo_type__c = 'Type 1';
        myDemo.innohub__Clouds_Involved__c  = 'Value 1';
        myDemo.innohub__Category__c  = 'Value 1';
        insert myDemo;  
        
        //Type Recent
        String selectedFilter = 'Type';
        String searchFiltersJSON = '[{"filterName":"Type","selectedFilters":["\'Recent\'"]}]';
        
        List<innohub__Demo__c> theDemos = IH_DemoCtr.getDemos(selectedFilter, searchFiltersJSON);
        
        //ASSERT EQUALS
        system.assertEquals(theDemos.size(), 1);
        
        //Type Type 1
        String selectedFilter_1 = 'Type';
        String searchFiltersJSON_1 = '[{"filterName":"Type","selectedFilters":["\'Type 1\'"]}]';
        
        List<innohub__Demo__c> theDemos_1 = IH_DemoCtr.getDemos(selectedFilter_1, searchFiltersJSON_1);
        
        //ASSERT EQUALS
        system.assertEquals(theDemos_1.size(), 1);
        
        //Workstreams Value 1
        String selectedFilter_2 = 'Workstreams';
        String searchFiltersJSON_2 = '[{"filterName":"Workstreams","selectedFilters":["\'Value 1\'"]}]';
        
        List<innohub__Demo__c> theDemos_2 = IH_DemoCtr.getDemos(selectedFilter_2, searchFiltersJSON_2);
        
        //ASSERT EQUALS
        system.assertEquals(theDemos_2.size(), 0);
        
        //DemoType Type 2
        String selectedFilter_3 = 'DemoType';
        String searchFiltersJSON_3 = '[{"filterName":"DemoType","selectedFilters":["\'Type 2\'"]}]';
        
        List<innohub__Demo__c> theDemos_3 = IH_DemoCtr.getDemos(selectedFilter_3, searchFiltersJSON_3);
        
        //ASSERT EQUALS
        system.assertEquals(theDemos_3.size(), 0);
        
        //Category Value 1
        String selectedFilter_4 = 'Category';
        String searchFiltersJSON_4 = '[{"filterName":"Category","selectedFilters":["\'Value 1\'"]}]';
        
        List<innohub__Demo__c> theDemos_4 = IH_DemoCtr.getDemos(selectedFilter_4, searchFiltersJSON_4);
        
        //ASSERT EQUALS
        system.assertEquals(theDemos_3.size(), 0);
    }
    
    global static testMethod void testGetPoints(){
        Double points;
        
        innohub__Demo__c myDemo = new innohub__Demo__c();
        myDemo.Name = 'Test';
        insert myDemo;  
        
        innohub__Demo_Vote__c myVote1 = new innohub__Demo_Vote__c();
        myVote1.innohub__Vote_Type__c = True;
        myVote1.innohub__Demo__c = myDemo.Id;
        
        insert myVote1;
        
        List<Double> myList = new List<Double>();
        Double myDouble = IH_DemoCtr.getPoints(myDemo.Id);
        myList.add(myDouble);
        
        System.assertEquals(myList.size(), 1);
    }
    
        
    global static testMethod void testGetCreator(){
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
        
        User theUser = IH_DemoCtr.getCreator(user.Id);
        
        List<User> userList = new List<User>();
        userList.add(theUser);
        System.assertEquals(userList.size(), 1);
    }
    
    global static testMethod void testGetDemo(){
        innohub__Demo__c myDemo = new innohub__Demo__c();
        myDemo.Name = 'Test';
        insert myDemo; 
        
        innohub__Demo__c theReturnedDemo = IH_DemoCtr.getDemo(myDemo.Id);
        
        List<innohub__Demo__c> demoList = new List<innohub__Demo__c>();
        demoList.add(myDemo);
        System.assertEquals(demoList.size(), 1);
    }
    
    global static testMethod void testCheckVote(){        
        innohub__Demo__c myDemo = new innohub__Demo__c();
        myDemo.Name = 'Test';
        insert myDemo;
        
        innohub__Demo_Vote__c myVote1 = new innohub__Demo_Vote__c();
        myVote1.innohub__Vote_Type__c = True;
        myVote1.innohub__Demo__c = myDemo.Id;
        insert myVote1;
        
        Boolean theVote = IH_DemoCtr.checkVote(myDemo.Id);
        
        //ASSERT EQUALS
        system.assertEquals(theVote, true);
    }
    
    global static testMethod void testUpvote(){
        innohub__Demo__c myDemo = new innohub__Demo__c();
        myDemo.Name = 'Test';
        insert myDemo;
        
        innohub__Demo_Vote__c myVote1 = new innohub__Demo_Vote__c();
        myVote1.innohub__Vote_Type__c = True;
        myVote1.innohub__Demo__c = myDemo.Id;
        insert myVote1;
        List<Boolean> myBooleans = new List<Boolean>();
        Boolean theVote = IH_DemoCtr.upvote(myDemo.Id);
        myBooleans.add(theVote);
        
        System.assertEquals(myBooleans.size(), 1); 
        
        innohub__Demo__c myDemo_1 = new innohub__Demo__c();
        myDemo.Name = 'Test 1';
        insert myDemo_1;
        
        List<Boolean> myBooleans_1 = new List<Boolean>();
        Boolean theVote_1 = IH_DemoCtr.upvote(myDemo_1.Id);
        
        system.assertEquals(theVote_1, null);
    }
    
    global static testMethod void testDownvote(){
        innohub__Demo__c myDemo = new innohub__Demo__c();
        myDemo.Name = 'Test';
        insert myDemo;
        
        innohub__Demo_Vote__c myVote1 = new innohub__Demo_Vote__c();
        myVote1.innohub__Vote_Type__c = False;
        myVote1.innohub__Demo__c = myDemo.Id;
        insert myVote1;
        List<Boolean> myBooleans = new List<Boolean>();
        Boolean theVote = IH_DemoCtr.downvote(myDemo.Id);
        myBooleans.add(theVote);
        
        System.assertEquals(myBooleans.size(), 1); 
        
        innohub__Demo__c myDemo_1 = new innohub__Demo__c();
        myDemo.Name = 'Test 1';
        insert myDemo_1;
        
        List<Boolean> myBooleans_1 = new List<Boolean>();
        Boolean theVote_1 = IH_DemoCtr.downvote(myDemo_1.Id);
        
        system.assertEquals(theVote_1, null);
    }
    
    global static testMethod void testGetLoggedInUser(){
        User myUser = IH_DemoCtr.getLoggedInUser();
        
        //ASSERT EQUALS
        List<User> userList = new List<User>();
        userList.add(myUser);
        system.assertEquals(userList.size(), 1);
    }
    
    static testMethod void testFirstSubmissionCheck(){
        Id p = [select id from profile where name='Innohub General User'].id;
        
        Account ac = new Account(name ='GrazittiFurstSub') ;
        insert ac; 
        
        Contact con = new Contact(LastName ='testCon2',AccountId = ac.Id);
        insert con;  
        
        User user = new User(alias = 'test124', email='test124@noemail.com',
                             emailencodingkey='UTF-8', lastname='Testing', languagelocalekey='en_US',
                             localesidkey='en_US', profileid = p, country='United States',IsActive=true,
                             ContactId = con.Id,
                             timezonesidkey='America/Los_Angeles', username='tester4@dermo.com');
        
        insert user;
        
        innohub__Demo__c myDemo = new innohub__Demo__c();
        myDemo.Name = 'Test Demo';
        myDemo.OwnerId = user.Id;
        insert myDemo; 
        
        innohub__Demo_Scorecard__c myScorecard = new innohub__Demo_Scorecard__c();
        myScorecard.innohub__Demo__c = myDemo.Id;
        myScorecard.OwnerId = user.Id;
        insert myScorecard;
        
        innohub__Demo_Scorecard__c myReturnScorecard = IH_DemoCtr.firstSubmissionCheck(myDemo.Id, user);
        
        List<innohub__Demo_Scorecard__c> myScorecards = new List<innohub__Demo_Scorecard__c>();
        myScorecards.add(myReturnScorecard);
        system.assertEquals(myScorecards.size(), 1);
    }
    
    global static testMethod void testGetPicklistValues(){
        List<String> myPicks = IH_DemoCtr.getPicklistValues('innohub__Category__c');
        
        System.assertEquals(myPicks.size(), 5);
    }
    
    global static testMethod void testGetPicklistLabel(){
        String myLabel = IH_DemoCtr.getPicklistLabel('innohub__Category__c');
        
        System.assertEquals(myLabel, 'Category');
    }
}
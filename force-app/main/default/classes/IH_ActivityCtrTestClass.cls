@isTest
global with sharing class IH_ActivityCtrTestClass {
    
    global static testMethod void testGetActivities(){
        innohub__Activity__c myActivity = new innohub__Activity__c();
        myActivity.Name = 'Test Diarmuid';
        myActivity.innohub__Type__c = 'Category 1';
        myActivity.innohub__BU__c = 'VALUE 1';
        insert myActivity;
        
        //Category
        String selectedFilter = 'Category';
        String searchFiltersJSON = '[{"filterName":"Category","selectedFilters":["\'Category 1\'"]}]';
        
        List<innohub__Activity__c> theActivities = IH_ActivityCtr.getActivities(selectedFilter, searchFiltersJSON);
        system.assertEquals(theActivities.size(), 0);
        
        //BU
        String selectedFilter_1 = 'BU';
        String searchFiltersJSON_1 = '[{"filterName":"BU","selectedFilters":["\'Value 1\'"]}]';
        
        List<innohub__Activity__c> theActivities_1 = IH_ActivityCtr.getActivities(selectedFilter_1, searchFiltersJSON_1);
        system.assertEquals(theActivities_1.size(), 0);
        
        //Type All
        String selectedFilter_2 = 'Type';
        String searchFiltersJSON_2 = '[{"filterName":"Type1","selectedFilters":["All"]}]';
        
        List<innohub__Activity__c> theActivities_2 = IH_ActivityCtr.getActivities(selectedFilter_2, searchFiltersJSON_2);
        system.assertEquals(theActivities_2.size(), 1);
        
        
    }
    
    global static testMethod void testGetTypes(){
        List<String> options = IH_ActivityCtr.getTypes();
        System.assertEquals(options.size(), 5);
    }
    
    
    
    global static testMethod void testGetActivity(){
        innohub__Activity__c myActivity = new innohub__Activity__c();
        myActivity.Name = 'Test Diarmuid';
        myActivity.innohub__Type__c = 'Category 1';
        insert myActivity;
        
        innohub__Activity__c theReturnedActivity = IH_ActivityCtr.getActivity(myActivity.Id);
        
        List<innohub__Activity__c> myAct = new List<innohub__Activity__c>();
        myAct.add(theReturnedActivity);
        system.assertEquals(myAct.size(), 1);
    }
    
    global static testMethod void testGetIdeaRecordTypes(){
        List<innohub.IH_ActivityCtr.myRecordTypeStructure> theRecordList = IH_ActivityCtr.getIdeaRecordTypes();
        system.assertEquals(theRecordList.size(), 4);
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
        
        User theUser = IH_ActivityCtr.getCreator(user.Id);
        
        List<User> theUserList = new List<User>();
        theUserList.add(theUser);
        
        System.assertEquals(theUserList.size(), 1);
    }
       global static testMethod void testGetPicklistValues(){
        List<String> myPicks = IH_ActivityCtr.getPicklistValues('innohub__Type__c');
        
        System.assertEquals(myPicks.size(), 5);
    }
    
    global static testMethod void testGetPicklistLabel(){
        String myLabel = IH_ActivityCtr.getPicklistLabel('innohub__Type__c');
        
        System.assertEquals(myLabel, 'Category');
    }
    
    global static testMethod void testGetRecordTypeRadio(){
        Map<String, String> myMap = IH_ActivityCtr.getRecordTypeRadio();
        
        System.assertEquals(myMap.size(), 4);
    }
}
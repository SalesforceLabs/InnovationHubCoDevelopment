@isTest
global with sharing class IH_UserVoice_TestClass {

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
        
        User theUser = IH_UserVoiceCtr.getCreator(user.Id);
        
        List<User> userList = new List<User>();
        userList.add(theUser);
        system.assertEquals(userList.size(), 1);
    }
    
    global static testMethod void testGetUserVoices(){ 
        innohub__User_Voice__c myUserVoice = new innohub__User_Voice__c();
        myUserVoice.Name = 'Test';
        myUserVoice.innohub__Workstream__c = 'Value 1';
        insert myUserVoice;  
        
        //Type All
        String selectedFilter = 'Type';
        String searchFiltersJSON = '[{"filterName":"Type","selectedFilters":["\'All\'"]}]';
        
        List<innohub__User_Voice__c> theUserVoices = IH_UserVoiceCtr.getUserVoices(selectedFilter, searchFiltersJSON);
        system.assertEquals(theUserVoices.size(), 1);
        
        //Type Recent
        String selectedFilter_1 = 'Type';
        String searchFiltersJSON_1 = '[{"filterName":"Type","selectedFilters":["\'Recent\'"]}]';
        
        List<innohub__User_Voice__c> theUserVoices_1 = IH_UserVoiceCtr.getUserVoices(selectedFilter_1, searchFiltersJSON_1);
        system.assertEquals(theUserVoices_1.size(), 1);
        
        //Workstreams Marketing Coud
        String selectedFilter_2 = 'Workstreams';
        String searchFiltersJSON_2 = '[{"filterName":"Workstreams","selectedFilters":["\'Value 1\'"]}]';
        
        List<innohub__User_Voice__c> theUserVoices_2 = IH_UserVoiceCtr.getUserVoices(selectedFilter_2, searchFiltersJSON_2);
        system.assertEquals(theUserVoices_2.size(), 0);
    }
    
    global static testMethod void testGetUserVoice(){ 
        innohub__User_Voice__c myUserVoice = new innohub__User_Voice__c();
        myUserVoice.Name = 'Test';
        insert myUserVoice;  
        
        IH_UserVoiceCtr.getUserVoice(myUserVoice.Id);
        
        List<innohub__User_Voice__c> userVoiceList = new List<innohub__User_Voice__c>();
        userVoiceList.add(myUserVoice);
        system.assertEquals(userVoiceList.size(), 1);
    }
    
     global static testMethod void testGetPicklistValues(){
        List<String> myPicks = IH_UserVoiceCtr.getPicklistValues('innohub__Workstream__c');
        
        System.assertEquals(myPicks.size(), 5);
    }
    
    global static testMethod void testGetPicklistLabel(){
        String myLabel = IH_UserVoiceCtr.getPicklistLabel('innohub__Workstream__c');
        
        System.assertEquals(myLabel, 'Workstream');
    }
}
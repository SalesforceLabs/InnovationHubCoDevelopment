@isTest
global with sharing class IH_prototypeCtrTestClass {
    
    global static testMethod void testGetPrototypes(){
        innohub__Prototype__c myPrototype = new innohub__Prototype__c();
        myPrototype.Name = 'Test Diarmuid';
        myPrototype.innohub__Region__c = 'Region 1';
        myPrototype.innohub__Workstream__c = 'Value 1';
        insert myPrototype;
        
        //Type Recent
        String selectedFilter = 'Type';
        String searchFiltersJSON = '[{"filterName":"Type","selectedFilters":["\'Recent\'"]}]';
        
        List<innohub__Prototype__c> thePrototypes = IH_PrototypeCtr.getPrototypes(selectedFilter, searchFiltersJSON);
        
        system.assertEquals(thePrototypes.size(), 1);
        
        //Region Sales reps
        String selectedFilter_1 = 'Region';
        String searchFiltersJSON_1 = '[{"filterName":"Region","selectedFilters":["\'Region 1\'"]}]';
        
        List<innohub__Prototype__c> thePrototypes_1 = IH_PrototypeCtr.getPrototypes(selectedFilter_1, searchFiltersJSON_1);
        
        system.assertEquals(thePrototypes_1.size(), 0);
        
        //Type My Prototypes
        String selectedFilter_2 = 'Type';
        String searchFiltersJSON_2 = '[{"filterName":"Type","selectedFilters":["\'My Prototypes\'"]}]';
        
        List<innohub__Prototype__c> thePrototypes_2 = IH_PrototypeCtr.getPrototypes(selectedFilter_2, searchFiltersJSON_2);
        
        system.assertEquals(thePrototypes_2.size(), 1);
        
        //Workstream Value 1
        String selectedFilter_3 = 'Workstreams';
        String searchFiltersJSON_3 = '[{"filterName":"Workstreams","selectedFilters":["\'Value 1\'"]}]';
        
        List<innohub__Prototype__c> thePrototypes_3 = IH_PrototypeCtr.getPrototypes(selectedFilter_3, searchFiltersJSON_3);
        
        system.assertEquals(thePrototypes_2.size(), 1);
    }
    
    global static testMethod void testGetPrototype(){
        innohub__Prototype__c myPrototype = new innohub__Prototype__c();
        myPrototype.Name = 'Test Diarmuid';
        insert myPrototype;
        
        innohub__Prototype__c myReturnedPrototype = IH_PrototypeCtr.getPrototype(myPrototype.Id);
        
        List<innohub__Prototype__c> prototypeList = new List<innohub__Prototype__c>();
        prototypeList.add(myReturnedPrototype);
        
        system.assertEquals(prototypeList.size(), 1);
    }
    
    global static testMethod void testGetCategories(){
        List<String> options = IH_PrototypeCtr.getCategories();
        System.assertEquals(options.size(), 5);
    }
    
    global static testMethod void testGetWorkstreams(){
        List<String> options = IH_PrototypeCtr.getWorkstreams();
        System.assertEquals(options.size(), 5);
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
        
        User theUser = IH_prototypeCtr.getCreator(user.Id);
        
        List<User> listUser = new List<User>();
        listUser.add(theUser);
        System.assertEquals(listUser.size(), 1);
    }
    
        global static testMethod void testGetPicklistValues(){
        List<String> myPicks = IH_prototypeCtr.getPicklistValues('innohub__Workstream__c');
        
        System.assertEquals(myPicks.size(), 5);
    }
    
    global static testMethod void testGetPicklistLabel(){
        String myLabel = IH_prototypeCtr.getPicklistLabel('innohub__Workstream__c');
        
        System.assertEquals(myLabel, 'Workstream');
    }
}
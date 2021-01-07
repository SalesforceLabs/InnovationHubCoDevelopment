@isTest
public with sharing class IHvideoController_TestClass {
    public static testMethod void testGetVideo(){
        innohub__Innovation_Idea__c myVideo = new innohub__Innovation_Idea__c(
            innohub__Video_URL__c = 'https://www.youtube.com/',
            innohub__Video_File_Id__c = 'someText',
            innohub__Video_Title__c = 'someText',
            Name = 'Mary'   
        );
        
        insert myVideo; 
        
        sObject returnVideo = IHvideoController.getVideo(myVideo.Id);
                
        System.assertEquals(returnVideo.Id,myVideo.Id);
        
        System.assertEquals(returnVideo.get('innohub__Video_URL__c'),myVideo.innohub__Video_URL__c);
        System.assertEquals(returnVideo.get('innohub__Video_File_Id__c'),myVideo.innohub__Video_File_Id__c);
        System.assertEquals(returnVideo.get('innohub__Video_Title__c'),myVideo.innohub__Video_Title__c);
    }
    
    public static testMethod void checkVideoExists(){
        
    }
}
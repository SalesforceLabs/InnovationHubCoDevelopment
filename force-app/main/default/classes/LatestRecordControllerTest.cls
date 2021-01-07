@isTest
private class LatestRecordControllerTest {
    @IsTest
    static void runPositiveTestCases(){
        List<Innovation_Idea__c> testIdeas = new List<Innovation_Idea__c>();
        Innovation_Idea__c expectedIdea = new Innovation_Idea__c();
        expectedIdea.Name = 'Expected';
        expectedIdea.Approval_Status__c = 'Approved';
        testIdeas.add(expectedIdea);

        Innovation_Idea__c testIdea = new Innovation_Idea__c();
        testIdea.Name = 'Not Expected';
        testIdeas.add(testIdea);

        insert testIdeas;

        Test.startTest();
        String clauseCondition = 'Approval_Status__c = \'Approved\'';
        String latestRecordId = LatestRecordController.getLatestRecordId('Innovation_Idea__c', clauseCondition);
        System.assertEquals(expectedIdea.Id, latestRecordId, 'Didn\'t return the correct latest record');
        Test.stopTest();
    }
}
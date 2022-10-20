@isTest
private class MetricsCounterControllerTest {
    @IsTest
    static void runPositiveTestCases(){
        Challenge__c challenge = generateTestRecords();

        Test.startTest();
        try {
            String parameterJsonString = '{"recordId":"' + challenge.Id + '","childObjectApiName":"Innovation_Idea__c","lookupFieldApiName":"Challenge__c"}';
            MetricsCounterController.MetricsCounterResult result = MetricsCounterController.getRecordMetrics(parameterJsonString);
            System.assertEquals(2, result.childRecordCount, 'Couldn\'t find right number of child records');
            System.assertEquals(3, result.chatterPostCount, 'Couldn\'nt find the right number of chatter posts');
        } catch (Exception e) {
            System.assertEquals(null, e, 'getChildRecordCount threw an error');
        }
        Test.stopTest();
    }
        
    // Generates sample test challenge and child records
    static Challenge__c generateTestRecords() {
        Challenge__c challenge = generateChallengeRecord();
        List<Innovation_Idea__c> ideas = generateIdeaRecords(challenge);
        List<FeedItem> chatterPosts = generateChatterPosts(challenge);
        return challenge;
    }

    static Challenge__c generateChallengeRecord() {
        // Create parent Challenge__c record
        Challenge__c challenge = new Challenge__c();
        challenge.Name = 'Test Challenge';
        insert challenge;
        return challenge;
    }

    static List<Innovation_Idea__c> generateIdeaRecords(Challenge__c challenge) {
        // Create related ideas
        Id ideaRecordTypeId = Schema.SObjectType.Innovation_Idea__c.getRecordTypeInfosByName().get('Idea').getRecordTypeId();
        List<Innovation_Idea__c> ideas = new List<Innovation_Idea__c>();
        for(Integer i = 0; i<2; i++) {
            Innovation_Idea__c idea = new Innovation_Idea__c();
            idea.RecordTypeId = ideaRecordTypeId;
            idea.Name = 'Test Idea ' + i;
            idea.Challenge__c = challenge.Id;
            ideas.add(idea);
        }
        insert ideas;
        return ideas;
    }

    static List<FeedItem> generateChatterPosts(Challenge__c challenge) {
        // Query related idea records
        List<Innovation_Idea__c> ideas = [SELECT Id FROM Innovation_Idea__c WHERE Challenge__c =: challenge.Id];

        // Create Chatter posts
        List<FeedItem> chatterPosts = new List<FeedItem>();
        FeedItem challengePost = new FeedItem();
        challengePost.ParentId = challenge.Id;
        challengePost.Body = 'Test Body';
        chatterPosts.add(challengePost);
        for(Innovation_Idea__c idea : ideas) {
            FeedItem post = new FeedItem();
            post.ParentId = idea.Id;
            post.Body = 'Test Body';
            chatterPosts.add(post);
        }
        insert chatterPosts;
        return chatterPosts;
    }
}
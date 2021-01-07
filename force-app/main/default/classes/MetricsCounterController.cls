public with sharing class MetricsCounterController {
    @AuraEnabled(cacheable=true)
    public static MetricsCounterResult getRecordMetrics(String stringifiedParameters){
        System.debug(stringifiedParameters);
        MetricsCounterFunctionParameter parameter = parseParameters(stringifiedParameters);
        MetricsCounterResult result = new MetricsCounterResult();
        result.chatterPostCount = getChatterPostCount(parameter);
        result.childRecordCount = getChildRecordCount(parameter);
        System.debug(result);
        return result;        
    }

    private static Integer getChildRecordCount(MetricsCounterFunctionParameter parameter) {
        Integer recordCount = 0;
        String childRecordCountQuery = 'SELECT count() FROM ' + parameter.childObjectApiName + ' WHERE ' + parameter.lookupFieldApiName + '=\'' + parameter.recordId + '\' WITH SECURITY_ENFORCED';
        try {
            recordCount = Database.countQuery(childRecordCountQuery);
        } catch (Exception e) {
            System.debug(e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
        return recordCount;
    }

    private static Integer getChatterPostCount(MetricsCounterFunctionParameter parameter) {
        Integer chatterPostCount = 0;
        try {
            Integer parentRecordFeedItemCount = [SELECT count() FROM FeedItem WHERE ParentId =: parameter.recordId WITH SECURITY_ENFORCED];
            String childRecordsQuery = 'SELECT Id FROM ' + parameter.childObjectApiName + ' WHERE ' + parameter.lookupFieldApiName + '=\'' + parameter.recordId + '\' WITH SECURITY_ENFORCED';
            List<Id> childRecordIds = new List<Id>();
            List<sObject> childRecords = Database.query(childRecordsQuery);
            for (sObject childRecord : childRecords) {
                childRecordIds.add(childRecord.Id);
            }
            Integer childRecordPostCount = [SELECT count() FROM FeedItem WHERE ParentId IN :childRecordIds WITH SECURITY_ENFORCED];
            chatterPostCount = chatterPostCount + parentRecordFeedItemCount + childRecordPostCount;
        } catch (Exception e) {
            System.debug(e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
        return chatterPostCount;
    }

    private static MetricsCounterFunctionParameter parseParameters(String json) {
        return (MetricsCounterFunctionParameter)System.JSON.deserialize(json, MetricsCounterFunctionParameter.class);
    }

    private class MetricsCounterFunctionParameter {
        private Id recordId;
        private String childObjectApiName;
        private String lookupFieldApiName;
    }

    public class MetricsCounterResult {
        @AuraEnabled
        public Integer childRecordCount {get; set;}
        @AuraEnabled
        public Integer chatterPostCount {get; set;}
    }
}
public with sharing class LatestRecordController {
    @AuraEnabled(cacheable=true)
    public static String getLatestRecordId(String sObjectApiName, String conditionalClause){
        String query = 'SELECT Id FROM ' + sObjectApiName + ' WHERE isDeleted = false ';
        String countQuery = 'SELECT count() FROM ' + sObjectApiName + ' WHERE isDeleted = false ';
        if (conditionalClause != NULL && conditionalClause != '') {
            query = query + ' AND ' + conditionalClause + ' ';
            countQuery = countQuery + ' AND ' + conditionalClause + ' ';
        }
        query = query + ' WITH SECURITY_ENFORCED ORDER BY CreatedDate DESC NULLS LAST LIMIT 1';
        countQuery = countQuery + ' WITH SECURITY_ENFORCED';

        System.debug(query);
        System.debug(countQuery);
        try {
            Integer recordCount = Database.countQuery(countQuery);
            if (recordCount == 0) {
                return '';
            }
            sObject latestRecord = Database.query(query);
            return latestRecord.Id;
        } catch (Exception e) {
            System.debug(e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }
}
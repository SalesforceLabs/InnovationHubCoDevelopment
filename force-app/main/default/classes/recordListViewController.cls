public with sharing class recordListViewController {

    @AuraEnabled(cacheable = true)  
    public static Integer getRecordCount(String objApiName, String lookupField, String contextId, String filters, String sortBy, String show, String recordTypeId, String votesObject, String voteObjectLookup, String userType, String approvalCondition, String voteField) {  
        String query = 'select count() from ' + objApiName + ' WHERE IsDeleted = false';
        if(!String.isBlank(lookupField) && !String.isBlank(contextId)){
            query += ' AND ' + lookupField + ' = \''+contextId+'\'';
        }

        String userField;
        Boolean restrictRecords = true;

        if(userType == 'Creator'){
            userField = 'CreatedById';
        }else{
            userField = 'OwnerId';
        }
        
        if(!String.isBlank(filters)){
            Map<String, Object> filterMap = (Map<String, Object>)JSON.deserializeUntyped(filters);
            SObjectType r = ((SObject)(Type.forName('Schema.'+objApiName).newInstance())).getSObjectType();
            DescribeSObjectResult d = r.getDescribe();
            for (String key : filterMap.keySet()) {
                if(d.fields.getMap().get(key).getDescribe().getType() == Schema.DisplayType.MULTIPICKLIST){
                    query += ' AND ' + key + ' INCLUDES (\''+ filterMap.get(key)+'\')';
                }else{
                    query += ' AND ' + key + ' = \''+ filterMap.get(key)+'\'';
                }
            }
        }

        if(!String.isBlank(recordTypeId)){
            query += ' AND RecordTypeId = \'' + recordTypeId + '\'';
        }

        if(!String.isBlank(show)){
            if(show == 'mySubmissions'){
                query += ' AND '+userField+' = \'' + userInfo.getUserId() + '\'';
                restrictRecords = false;
            }else if(show == 'liked' && !String.isBlank(votesObject) && !String.isBlank(voteObjectLookup)){
                String likedQuery = 'SELECT Id, '+voteObjectLookup+', '+voteField+'  FROM '+votesObject+' WHERE CreatedById = \''+userInfo.getUserId()+'\'';
                List<String> recordsLiked = new List<String>();
                for(sObject obj : Database.query(likedQuery)){
                    if(obj.get(voteField) == true){
                        recordsLiked.add('\'' + obj.get(voteObjectLookup)  + '\'');
                    }
                }
                if(recordsLiked.size()>0){
                    query += ' AND Id IN (' + string.join(recordsLiked,',') + ')';
                }else{ query += ' AND Id = null';}
            }
        }

        if(!String.isBlank(approvalCondition) && restrictRecords == true){
            query += ' AND ' + approvalCondition;
        }

        query +=' WITH SECURITY_ENFORCED';

        Integer NumberOfRecords = Database.countQuery(query);
        
        return NumberOfRecords;  
    }  

    @AuraEnabled(cacheable=true)
    public static List<sObject> getRecords(String objApiName, String fields, String voteField, String voteRecordRelationship, String votesObject, String voteObjectLookup, String lookupField, String contextId, Integer pageSize, Integer page, Boolean usePagination, String filters, String sortBy, String show, String recordTypeId, String name, String points, String recommended, String userType, String approvalCondition) {
        String userField;
        Boolean restrictRecords = true;

        String query = 'SELECT ' + fields ;
        if(!String.isBlank(voteField) && !String.isBlank(voteRecordRelationship)){
            query += ', (SELECT CreatedById, ' + voteField + ' FROM '+voteRecordRelationship+' WHERE CreatedById = \''+userInfo.getUserId()+'\')';
        }
        if(userType == 'Creator'){
            query += ', CreatedBy.Name, CreatedBy.SmallPhotoUrl';
            userField = 'CreatedById';
        }else{
            query += ', typeof Owner when user then Id, Name, SmallPhotoUrl, FullPhotoUrl, MediumPhotoUrl when Group then Id, Name, Type end';
            userField = 'OwnerId';
        }
        query += ' FROM ' + objApiName + ' WHERE IsDeleted = false';

        if(!String.isBlank(lookupField) && !String.isBlank(contextId)){
            query += ' AND ' + lookupField + ' = \''+contextId+'\'';
        }

        if(!String.isBlank(filters)){
            Map<String, Object> filterMap = (Map<String, Object>)JSON.deserializeUntyped(filters);
            SObjectType r = ((SObject)(Type.forName('Schema.'+objApiName).newInstance())).getSObjectType();
            DescribeSObjectResult d = r.getDescribe();
            for (String key : filterMap.keySet()) {
                if(d.fields.getMap().get(key).getDescribe().getType() == Schema.DisplayType.MULTIPICKLIST){
                    query += ' AND ' + key + ' INCLUDES (\''+ filterMap.get(key)+'\')';
                }else{
                    query += ' AND ' + key + ' = \''+ filterMap.get(key)+'\'';
                }
            }
        }

        if(!String.isBlank(recordTypeId)){
            query += ' AND RecordTypeId = \'' + recordTypeId + '\'';

        }

        if(!String.isBlank(show)){
            if(show == 'mySubmissions'){
                query += ' AND '+userField+' = \'' + userInfo.getUserId() + '\'';
                restrictRecords = false;
            }else if(show == 'liked' && !String.isBlank(votesObject) && !String.isBlank(voteObjectLookup)){
                String likedQuery = 'SELECT Id, '+voteObjectLookup+', '+voteField+' FROM '+votesObject+' WHERE CreatedById = \''+userInfo.getUserId()+'\'';
                List<String> recordsLiked = new List<String>();
                for(sObject obj : Database.query(likedQuery)){
                    if(obj.get(voteField) == true){
                        recordsLiked.add('\'' + obj.get(voteObjectLookup)  + '\'');
                    }
                }
                if(recordsLiked.size()>0){
                    query += ' AND Id IN (' + string.join(recordsLiked,',') + ')';
                }else{ query += ' AND Id = null';}
            }
            
        }

        if(!String.isBlank(approvalCondition) && restrictRecords == true){
            query += ' AND ' + approvalCondition;
        }
        
        query +=' WITH SECURITY_ENFORCED';


        if(!String.isBlank(sortBy)){
            if(!String.isBlank(recommended)){
                query += ' ORDER BY ' + recommended +' DESC,';
            }else{
                query += ' ORDER BY ';
            }
            if(sortBy == 'oldest'){
                query += ' CreatedDate ASC';
            }else if(sortBy == 'popular'){
                if (!String.isBlank(points)) {
                query += ' '+points+' DESC';
                } else { query += ' CreatedDate DESC';
                }
            }else if(sortBy == 'alphabetically'  && !String.isBlank(name)){
                query += ' '+name+' ASC';
            }else if(sortBy == 'newest'){
            query += ' CreatedDate DESC';}
            
        }else{
            if(!String.isBlank(recommended)){
                query += ' ORDER BY '+recommended+' DESC, CreatedDate DESC';
            }else{
                query += ' ORDER BY CreatedDate DESC';
            }
        }

        if(usePagination == true){
            query += ' limit ' + pageSize + ' offset ' + (pageSize * (page - 1));  
        }

        try {
            return Database.query(query);
        } catch(exception e) {
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static void vote(String id, String sObj, String field, Boolean vote, String relationshipField) {
        try {
            String query = 'SELECT Id FROM ' + sObj + ' WHERE CreatedById = \'' + userInfo.getUserId() + '\' AND '+ relationshipField +' = \'' + id + '\' WITH SECURITY_ENFORCED';
            List<sObject> votes = Database.query(query);
            if(vote == false){
                if(votes.size() > 0){
                    Database.delete(votes[0].Id, true);
                }         
            }else if(vote == true){
                if(votes.size() < 1){
                sObjectType votesObjType = Schema.getGlobalDescribe().get(sObj);
                sObject voteObject = votesObjType.newSObject();
                voteObject.put(field,vote);
                voteObject.put(relationshipField,id);
                insert voteObject;
                }else{
                    sObjectType votesObjType = Schema.getGlobalDescribe().get(sObj);
                    sObject voteObject = votesObjType.newSObject();
                    voteObject.put(field,vote);
                    voteObject.put(relationshipField,id);
                    voteObject.Id = votes[0].Id;
                    update voteObject;
                }
            }
        } catch(exception e) {
            throw new AuraHandledException('The following exception has occurred: ' + e.getMessage());
        }
    }
}
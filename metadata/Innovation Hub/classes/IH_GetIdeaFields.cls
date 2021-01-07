global with sharing class IH_GetIdeaFields extends VisualEditor.DynamicPickList{
    
    global override VisualEditor.DataRow getDefaultValue(){
        VisualEditor.DataRow defaultValue = new VisualEditor.DataRow('None', 'None');
        return defaultValue;
    }
    global override VisualEditor.DynamicPickListRows getValues() {
        
        
        SObjectType objectType = Schema.getGlobalDescribe().get('innohub__Innovation_Idea__c');
        //Map<String,Schema.SObjectField> mfields = objectType.getDescribe().fields.getMap();
        
        VisualEditor.DynamicPickListRows  myValues = new VisualEditor.DynamicPickListRows();
        
        List<String> originalList= new List<String> ();
        List<String> labelList = new List<String> ();
        //Map<String, String> lvMap = new Map <String, String> ();
        list<List<String>> mapList = new list<List<String>>();
        for(String objField : objectType.getDescribe().fields.getMap().keySet()){
            List<String> lvMap = new List <String> ();
            lvMap.add(Schema.getGlobalDescribe().get('innohub__Innovation_Idea__c').getDescribe().fields.getMap().get(objField).getDescribe().getLabel());
            lvMap.add(Schema.getGlobalDescribe().get('innohub__Innovation_Idea__c').getDescribe().fields.getMap().get(objField).getDescribe().getName());
            
            mapList.add(lvMap);
            //originalList.add(objField);
            //labelList.add(Schema.getGlobalDescribe().get(mdt.Object_Name__c).getDescribe().fields.getMap().get(objField).getDescribe().getLabel());
        }
        /*
for(Schema.SObjectType objTyp : Schema.getGlobalDescribe().Values()){
originalList.add(String.valueOf(objTyp.getDescribe().getLabel()));
}
*/
        Set<String> myset = new Set<String>();
        
        List<String> result = new List<String>();
        
        myset.addAll(originalList);
        
        for(List<String> mapIterator : mapList){
            VisualEditor.DataRow val = new VisualEditor.DataRow(mapIterator[0], mapIterator[1]);
            myValues.addRow(val);
        }
        
        VisualEditor.DataRow val = new VisualEditor.DataRow('None', 'None');
        myValues.addRow(val);
        /*
for(String ms: myset){
//System.debug('MS IS:'+ms+'/');
if(ms != null){
VisualEditor.DataRow val = new VisualEditor.DataRow(ms, ms);
myValues.addRow(val); 
}
}
*/
        //result.addAll(myset);
        
        //return result;
        
        //myValues.addRow(value1);
        //myValues.addRow(value2);
        return myValues;
    }
}
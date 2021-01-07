public class myrecordTypeStructure {
    
    public Id myrecordTypeId {get; set;}
    
    public String myRecordTypeLabel {get; set;}
    
    public myrecordTypeStructure(Id myId, String myLabel){
        myrecordTypeId = myId;
        myRecordTypeLabel = myLabel;  
    }
}
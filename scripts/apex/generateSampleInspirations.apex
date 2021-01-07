// Generate some sample innohub__User_Voice__c (Inspiration) records

List<innohub__User_Voice__c> inspirations = new List<innohub__User_Voice__c>();

for(integer i = 0; i< 8; i++){
  innohub__User_Voice__c inspiration = new innohub__User_Voice__c();
  inspiration.Name = 'Very Inspirational. Must read! ' + i;
  inspiration.innohub__Headline__c = 'The Great Inspirator';
  inspiration.innohub__Introduction__c = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
  inspiration.innohub__Detail__c = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
  inspiration.innohub__Workstream__c = 'Value 2;Value 4';
  inspiration.innohub__Submitter_Detail__c = 'The Inspiration Seeker';
  inspirations.add(inspiration);
}

insert inspirations;
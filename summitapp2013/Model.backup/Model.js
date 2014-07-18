
guidedModel =
{
	Attendee :
	{
		events :
		{
			onSave:function()
			{
				if (this.fullName != null & this.firstName == null){
					var names = this.fullName.split(" ");
					this.firstName = names[0];
					this.lastName = names[1];
				}
			}
		},
		uniqueID :
		{
			events :
			{
				onInit:function(attributeName)
				{
					//this.uniqueID = generateUUID();
				}
			}
		}
	}
};

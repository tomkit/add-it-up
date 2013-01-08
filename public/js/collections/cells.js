define([ 'models/cell' ], function(Cell) {
    var Cells = Backbone.Collection.extend({

        model : Cell,

        /**
         * Constructor
         */
        initialize : function() {
            _.bindAll(this, 'wherePending');
        },
        
        wherePending : function(filter) {
            var filtered = [];
            var matched;
            _.each(this.models, function(cell) {
                if(cell.get('pending').activatedEquals(filter)) {                    
                    filtered.push(cell);
                }
                
                
            });
            
            return filtered;
        },
        
        grayTilesLeft : function() {
            var count = 0;
            _.each(this.models, function(cell) {
                if(cell.isGrayTile()) {
                    count++;
                }
            });
            
            return count;
        }

    });

    return Cells;
});

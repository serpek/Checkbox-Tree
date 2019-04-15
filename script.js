var data = [{
        "Id": 7393,
        "BrandText": "Alfa Romeo",
        "BrandGroups": [{
                "Id": 9879,
                "GroupText": "4C",
                "VehiclesCount": 1
            },
            {
                "Id": 9120,
                "GroupText": "Giulietta",
                "VehiclesCount": 1
            }
        ],
        "VehiclesCount": 2
    },
    {
        "Id": 7371,
        "BrandText": "Audi",
        "BrandGroups": [{
                "Id": 8823,
                "GroupText": "A3",
                "VehiclesCount": 6
            },
            {
                "Id": 8824,
                "GroupText": "A4",
                "VehiclesCount": 1
            },
            {
                "Id": 8825,
                "GroupText": "A6",
                "VehiclesCount": 1
            },
            {
                "Id": 8838,
                "GroupText": "Q7",
                "VehiclesCount": 1
            }
        ],
        "VehiclesCount": 9
    },
    {
        "Id": 7376,
        "BrandText": "Bentley",
        "BrandGroups": [{
            "Id": 10255,
            "GroupText": "Continental Gt",
            "VehiclesCount": 1
        }],
        "VehiclesCount": 1
    },
    {
        "Id": 7356,
        "BrandText": "Bmw",
        "BrandGroups": [{
                "Id": 8627,
                "GroupText": "1 Serisi",
                "VehiclesCount": 2
            },
            {
                "Id": 10205,
                "GroupText": "2 Serisi Active Tourer",
                "VehiclesCount": 2
            },
            {
                "Id": 8628,
                "GroupText": "3 Serisi",
                "VehiclesCount": 3
            }
        ],
        "VehiclesCount": 7
    },
    {
        "Id": 7352,
        "BrandText": "Ford",
        "BrandGroups": [{
            "Id": 8589,
            "GroupText": "Focus",
            "VehiclesCount": 1
        }],
        "VehiclesCount": 1
    }
];

function jsonClone(src) {
    return Object.assign({}, src);
}

function MenuItemModel(data) {
    this.checked = ko.observable(false);
    this.indeterminate = ko.observable(false);

    if (data.BrandGroups) {
        data.BrandGroups = ko.utils.arrayMap(data.BrandGroups, function(item) {
            return new MenuItemModel(item);
        });
    }
    return $.extend(this, data);
}

function TreeViewModel() {
    var self = this;
    var items = ko.utils.arrayMap(data, function(item) {
        return new MenuItemModel(item);
    });
    self.query = ko.observable("");
    self.itemList = ko.observableArray(items);

    self.toggle = function($data, $event) {
        var _label = $($event.target).closest('li').children('ul');
        _label.slideToggle();

    };

    self.check = function($parent, $data) {
        $data.checked(!$data.checked());
        if ($parent instanceof MenuItemModel) {}

        if ($data.BrandGroups) {
            ko.utils.arrayForEach($data.BrandGroups, function(item) {
                item.checked($data.checked());
            });
        }

        var checkedItems = ko.utils.arrayFilter($parent.BrandGroups, function(item) {
            return item.checked();
        });

        if ($parent instanceof MenuItemModel) {
            if (checkedItems.length === 0) {
                $parent.checked(false);
            } else {
                if (checkedItems.length < $parent.BrandGroups.length) {
                    $parent.indeterminate(true);
                } else {
                    $parent.indeterminate(false);
                }
                $parent.checked(true);
            }
        }
    };

    self.search = function(e) {
        var _query = self.query();

        if (_query.length <= 0) {
            self.itemList(items);
        } else {
            var temp = (items);
            var result = [];

            ko.utils.arrayForEach(temp, function(brand) {
                var filtered = ko.utils.arrayFilter(brand.BrandGroups, function(model) {
                    return model.GroupText.toLowerCase().indexOf(_query.toLowerCase()) >= 0;
                });

                if (filtered.length > 0) {
                    var _brand = new MenuItemModel(brand);
                    _brand.BrandGroups = filtered;

                    result.push(_brand);
                    window.setTimeout(function() {
                        $('#brand_' + _brand.Id).children('ul').slideDown();
                    }, 200);
                } else {
                    if (brand.BrandText.toLowerCase().indexOf(_query.toLowerCase()) >= 0) {
                        result.push(brand);
                    }
                }
            });

            self.itemList(result);
        }
    };
}

ko.applyBindings(new TreeViewModel(), document.getElementById('treeView'));
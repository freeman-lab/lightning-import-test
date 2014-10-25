var d3 = require('d3');
var _ = require('lodash');
var templateHTML = require('./roi.jade');
var request = require('superagent');



var ROIViz = function(selector, data, images, options) {

    var $el = $(selector).first();
    $el.append(templateHTML());

    if(data.points) {
        data = data.points;
    }

    // get one sample time series to set the axis bounds
    var url = $el.parent().find('.permalink').find('a').attr('href');
    r = request.get(url + '/data/timeseries/' + 0, function(res) {
            if((res.body.data || []).length) {
                console.log(res.body.data)
            }
        });

    var ScatterPlot = require('../viz/scatter');
    var scatter = new ScatterPlot(selector + ' #scatter-plot', data, null, {width: $(selector).width(), height: Math.min(500, $(selector).width * 0.6)});
    var LineChart = require('../viz/line');
    var line = new LineChart(selector + ' #line-chart', Array.apply(null, new Array(1000)).map(Number.prototype.valueOf,0), null, {width: $(selector).width(), height: 300});


    var r;
    scatter.on('hover', function(d) {

        var url = $el.parent().find('.permalink').find('a').attr('href');

        if(r) {
            r.abort();
        }

        r = request.get(url + '/data/timeseries/' + d.i, function(res) {
            if((res.body.data || []).length) {
                line.updateData(res.body.data);
            }
        });
    });


};




module.exports = ROIViz;

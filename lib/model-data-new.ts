const modelData = [
    {
        "Features":[
            "Soil_Moisture"
        ],
        "Accuracy":0.6086956522,
        "Specificity":0.6666666667,
        "Sensitivity":0.5,
        "AUC":0.5833333333,
        "Precision":0.4444444444,
        "F1":0.4705882353,
        "Confusion Matrix":{
            "True Positive":4,
            "True Negative":10,
            "False Positive":5,
            "False Negative":4
        }
    },
    {
        "Features":[
            "Rainfall_Rolling",
            "Temp_Rolling",
            "Humidity_Rolling"
        ],
        "Accuracy":0.7391304348,
        "Specificity":0.9333333333,
        "Sensitivity":0.375,
        "AUC":0.6541666667,
        "Precision":0.75,
        "F1":0.5,
        "Confusion Matrix":{
            "True Positive":3,
            "True Negative":14,
            "False Positive":1,
            "False Negative":5
        }
    },
    {
        "Features":[
            "Rainfall_Forecast",
            "Temp_Forecast",
            "Humidity_Forecast"
        ],
        "Accuracy":0.652173913,
        "Specificity":1.0,
        "Sensitivity":0.0,
        "AUC":0.5,
        "Precision":0.0,
        "F1":0.0,
        "Confusion Matrix":{
            "True Positive":0,
            "True Negative":15,
            "False Positive":0,
            "False Negative":8
        }
    },
    {
        "Features":[
            "Rainfall_Rolling",
            "Temp_Rolling",
            "Humidity_Rolling",
            "Rainfall_Forecast",
            "Temp_Forecast",
            "Humidity_Forecast"
        ],
        "Accuracy":0.6956521739,
        "Specificity":0.8666666667,
        "Sensitivity":0.375,
        "AUC":0.6208333333,
        "Precision":0.6,
        "F1":0.4615384615,
        "Confusion Matrix":{
            "True Positive":3,
            "True Negative":13,
            "False Positive":2,
            "False Negative":5
        }
    },
    {
        "Features":[
            "Soil_Moisture",
            "Rainfall_Rolling",
            "Temp_Rolling",
            "Humidity_Rolling",
            "Rainfall_Forecast",
            "Temp_Forecast",
            "Humidity_Forecast"
        ],
        "Accuracy":0.7391304348,
        "Specificity":0.7333333333,
        "Sensitivity":0.75,
        "AUC":0.7416666667,
        "Precision":0.6,
        "F1":0.6666666667,
        "Confusion Matrix":{
            "True Positive":6,
            "True Negative":11,
            "False Positive":4,
            "False Negative":2
        }
    },
    {
        "Features":[
            "Soil_Moisture",
            "Rainfall_Rolling",
            "Temp_Rolling",
            "Humidity_Rolling"
        ],
        "Accuracy":0.4347826087,
        "Specificity":0.5333333333,
        "Sensitivity":0.25,
        "AUC":0.3916666667,
        "Precision":0.2222222222,
        "F1":0.2352941176,
        "Confusion Matrix":{
            "True Positive":2,
            "True Negative":8,
            "False Positive":7,
            "False Negative":6
        }
    },
    {
        "Features":[
            "Soil_Moisture",
            "Rainfall_Forecast",
            "Temp_Forecast",
            "Humidity_Forecast"
        ],
        "Accuracy":0.7391304348,
        "Specificity":0.8,
        "Sensitivity":0.625,
        "AUC":0.7125,
        "Precision":0.625,
        "F1":0.625,
        "Confusion Matrix":{
            "True Positive":5,
            "True Negative":12,
            "False Positive":3,
            "False Negative":3
        }
    }
]

export default modelData

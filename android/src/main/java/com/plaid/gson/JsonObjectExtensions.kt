package com.plaid.gson

import com.google.gson.JsonObject

fun JsonObject.addPropertyIfNotNull(propertyName: String, propertyValue: String?) {
  propertyValue?.let {
    addProperty(propertyName, propertyValue)
  }
}

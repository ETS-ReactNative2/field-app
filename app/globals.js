import React, { useState, useEffect, useContext, useRef, cloneElement } from "react";
import { View, StyleSheet, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback, Text, Modal, ScrollView } from "react-native";
import Svg, { Path } from "react-native-svg";
import { createAppContainer, StackActions, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { AppLoading } from "expo";
import camelCaseKeys from "camelcase-keys";
import camelCase from "camelcase";
import snakeCaseKeys from "snakecase-keys";
import snakeCase from "to-snake-case";

import File from "./helpers/file";
import Download from "./helpers/download";
import Fingerprint from "./helpers/fingerprint";
import Secret from "./helpers/secret";
import Client from "./helpers/client";
import Logger from "./helpers/logger";
import AppContext from "./helpers/app_context";
import { Sequelize, Op, sequelize } from "./helpers/sequelize";
import timestampField from "./helpers/timestamp_field";
import createOrUpdate from "./helpers/create_or_update";
import { minBy, maxBy } from "./helpers/min_max_by";
import groupBy from "./helpers/group_by";
import mapNested from "./helpers/map_nested";
import eachNested from "./helpers/each_nested";
import className from "./helpers/class_name";
import replaceLocalhost from "./helpers/replace_localhost";
import resetEverything from "./helpers/reset_everything";
import filterIndex from "./helpers/filter_index";
import palette from "./helpers/palette";
import useForeground from "./hooks/use_foreground";
import useWifi from "./hooks/use_wifi";
import useWhen from "./hooks/use_when";
import useSecret from "./hooks/use_secret";

global.React = React;
global.useState = useState;
global.useEffect = useEffect;
global.useContext = useContext;
global.useRef = useRef;
global.cloneElement = cloneElement;
global.View = View;
global.StyleSheet = StyleSheet;
global.Touchable = TouchableWithoutFeedback;
global.TouchableOpacity = TouchableOpacity;
global.TouchableHighlight = TouchableHighlight;
global.Text = Text;
global.Modal = Modal;
global.ScrollView = ScrollView;
global.Svg = Svg;
global.Path = Path;
global.createAppContainer = createAppContainer;
global.StackActions = StackActions;
global.createSwitchNavigator = createSwitchNavigator;
global.createStackNavigator = createStackNavigator;
global.AppLoading = AppLoading;
global.camelCaseKeys = camelCaseKeys;
global.camelCase = camelCase;
global.snakeCaseKeys = snakeCaseKeys;
global.snakeCase = snakeCase;

global.File = File;
global.Download = Download;
global.Fingerprint = Fingerprint;
global.Secret = Secret;
global.Client = Client;
global.Logger = Logger;
global.AppContext = AppContext;
global.Sequelize = Sequelize;
global.Op = Op;
global.sequelize = sequelize;
global.timestampField = timestampField;
global.createOrUpdate = createOrUpdate;
global.minBy = minBy;
global.maxBy = maxBy;
global.groupBy = groupBy;
global.mapNested = mapNested;
global.eachNested = eachNested;
global.className = className;
global.replaceLocalhost = replaceLocalhost;
global.resetEverything = resetEverything;
global.filterIndex = filterIndex;
global.palette = palette;
global.verythin = StyleSheet.hairlineWidth;
global.thin = verythin * 2.5;
global.useForeground = useForeground;
global.useWifi = useWifi;
global.useWhen = useWhen;
global.useSecret = useSecret;

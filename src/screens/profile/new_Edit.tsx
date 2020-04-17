import React, { useEffect, useState } from 'react';
import { sh, sw, Adp } from '../../tools';
import {
	PageContainer,
	TouchFeedback,
	Iconfont,
	Row,
	CustomTextInput,
	ItemSeparator,
	WheelPicker
} from 'components';

import { Page, View, Text, Image, StyleSheet, TextInput, ScrollView } from '../../widgets';
import { Avatar } from 'hxf-react-native-uilib';
import * as ConstellPicker from './constellation';
import * as LovePicker from './loveOverlay';
import LocalStore from './LocalStore';
import { observer } from 'mobx-react';
import ImagePicker from 'react-native-image-crop-picker';


let NAV_BG = '#E5F57A';


const RightWidget = () => {
	return (
		<View style={styles.saveButton}>
			<Text style={styles.saveText}>保存</Text>
		</View>
	);
};

const EditPage = observer((props) => {
	const [gender, setgender] = useState(1);//0=男，1=女
	const [age, setage] = useState('');
	const [birthday, setbirthday] = useState('');
	const [constellation, setconstellation] = useState('');
	const [love, setlove] = useState('');
	const [avatar, setavatar] = useState('default_avatar');
	
	useEffect(() => {
		setconstellation(LocalStore?.constellation ?? '')
	}, [LocalStore.constellation])
	useEffect(() => {
		setlove(LocalStore?.love ?? '')
	}, [LocalStore.love])


	const changeAvatar = () => {
		ImagePicker.openPicker({
			width: 400,
			height: 400,
			cropping: true,
			includeBase64: true
		})
			.then(async image => {

				 setavatar( `data:${image.mime};base64,${image.data}`
				)
			})
			.catch(error => {});
	};


	const showDatePicker = () => {
		let Picker = new WheelPicker({
			onPickerConfirm: onDatePickerConfirm
		});
		Picker._showDatePicker(parseBirthday());
	};

	function onDatePickerConfirm(value: any, index: any) {

		setage(calcAge(value[0])),
			setbirthday(value.join(''))

	}

	function calcAge(value: any) {
		return new Date().getFullYear() - parseInt(value);

	}

	const parseBirthday = () => {

		if (birthday !== undefined) {
			return birthday.replace(/[年月日]/gi, '-').split('-');
		}
	}
	const showConstellPicker = () => {
		ConstellPicker.show()
	};
	const showLovePicker = () => {
		LovePicker.show()
	};




	return (
		<Page.Page navigation={props.navigation} safe arrow leftTitle={'完善资料'} navBackgroundColor={NAV_BG} rightWidget={
			<RightWidget />
		}>
			<ScrollView>
				<View style={styles.Avatar_war}>
				<TouchFeedback onPress={changeAvatar}>
				<Avatar uri={avatar} size={sw * 0.23} />
						</TouchFeedback>

					<Image source={{ uri: 'camera' }} style={{ height: 25, width: 25, position: 'absolute', right: sw * 0.4, top: sw * 0.25 }} resizeMode='contain' />
				</View>
				<View style={{ marginHorizontal: sw * 0.05 }}>
					<Text style={{ fontSize: 16, marginVertical: 30 }}>基本资料</Text>
					<View style={{ marginHorizontal: 20 }}>
						<Text style={{ color: '#73717F' }}>昵称：</Text>
						<TextInput
							placeholderTextColor={'#D4D3D3'}
							autoCorrect={false}
							placeholder="8个字以内"
							maxLength={8}
							style={styles.edittext}>
						</TextInput>
						<Text style={{ color: '#73717F' }}>个性签名：</Text>
						<View>
							<TextInput 
							placeholderTextColor={'#D4D3D3'}
							autoCorrect={false}
							placeholder="20个字以内"
							maxLength={20}
							style={styles.edittext}>
							</TextInput>
						</View>
						<Row style={styles.fieldGroup}>
							<Text style={styles.field}> 性别: </Text>
							<Row
								style={{
									marginLeft: 30
								}}
							>
								<TouchFeedback
									onPress={() =>
										setgender(1)
									}
									style={styles.genderGroup}
								>
									<Image
										source={
											gender === 1
												? require('../../assets/images/radio_fill.png')
												: require('../../assets/images/radio.png')
										}
										style={styles.genderItem}
									/>
									<Text
										style={{
											fontSize: 15,
											color: gender === 1 ? '#050501' : '#73717F'
										}}
									>
										女
								</Text>
								</TouchFeedback>
								<TouchFeedback
									onPress={() =>
										setgender(0)}
									style={styles.genderGroup}
								>
									<Image
										source={
											gender === 0
												? require('../../assets/images/radio_fill.png')
												: require('../../assets/images/radio.png')
										}
										style={styles.genderItem}
									/>
									<Text
										style={{
											color: gender === 0 ? '#050501' : '#73717F'
										}}
									>
										男
								</Text>
								</TouchFeedback>
							</Row>
						</Row>
						<Row style={styles.fieldGroup}>
							<Text style={styles.field}> 年龄: </Text>
							<TouchFeedback onPress={showDatePicker} style={styles.ageItem}>
								<Text
									style={{
										flex: 1,
										fontSize: 15,
										color: age ? '#050501' : '#73717F'
									}}
								>
									{age || '请选择日期'}
								</Text>
								<Iconfont name="right" color={'#000'} size={16} />
							</TouchFeedback>
						</Row>
						<Row style={styles.fieldGroup}>
							<Text style={styles.field}> 星座: </Text>
							<TouchFeedback onPress={showConstellPicker} style={styles.ageItem}>
								<Text
									style={{
										flex: 1,
										fontSize: 15,
										color: constellation ? '#050501' : '#73717F'
									}}
								>
									{constellation || '请选择星座'}
								</Text>
								<Iconfont name="right" color={'#000'} size={16} />
							</TouchFeedback>
						</Row>

						<Text style={{ color: '#73717F' }}>兴趣爱好：</Text>
						<TextInput 
						placeholderTextColor={'#D4D3D3'}
						autoCorrect={false}
						placeholder="10个字以内"
						maxLength={10}
						style={styles.edittext}>
						</TextInput>

					</View>
				</View>
				<View style={{ marginHorizontal: sw * 0.05 }}>
					<Text style={{ fontSize: 16, marginVertical: 30 }}>隐私资料</Text>
					<View style={{ marginHorizontal: 20 }}>
					<Row style={styles.fieldGroup}>
							<Text style={styles.field}> 恋爱状态: </Text>
							<TouchFeedback onPress={showLovePicker} style={styles.ageItem}>
								<Text
									style={{
										flex: 1,
										fontSize: 15,
										color: love ? '#050501' : '#73717F'
									}}
								>
									{love || '请选择恋爱状态'}
								</Text>
								<Iconfont name="right" color={'#000'} size={16} />
							</TouchFeedback>
						</Row>
						<Text style={{ color: '#73717F' }}>院校专业或从事行业：</Text>
						<View>
							<TextInput 
						    placeholderTextColor={'#D4D3D3'}
						    autoCorrect={false}
						    maxLength={20}
							style={styles.edittext}>
							</TextInput>
						</View>
					</View>
				</View>
			</ScrollView>
		</Page.Page>
	)
});

export default EditPage;

const styles = StyleSheet.create({
	Avatar_war: {
		width: sw,
		height: sw * 0.35,
		alignItems: 'center',
		justifyContent: 'center'
	},
	edittext: {
		borderBottomWidth: Adp.dp(1),
		borderColor: '#CCC9C9',
		marginBottom: 20
	},
	fieldGroup: {
		marginBottom: 30,
	},
	field: {
		fontSize: 14,
		color: '#666'
	},
	genderGroup: {
		flexDirection: 'row',
		alignItems: 'center',
		width: 100
	},
	genderItem: {
		width: 20,
		height: 20,
		marginRight: 8,
	},
	saveButton: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'flex-end',
		paddingEnd: 15
	},
	saveText: {
		fontSize: 16,
		textAlign: 'center',
		color: '#FD0900'
	},
	ageItem: {
		flex: 1,
		marginLeft: 30,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	}

})

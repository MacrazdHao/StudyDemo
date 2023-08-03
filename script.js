const WhiteBoardDom = document.getElementById('WhiteBoard')
const Context = WhiteBoardDom.getContext('2d')
const OperatorDom = document.getElementById('Operator')
let WindowWdith = document.body.offsetWidth
let WindowHeight = document.body.offsetHeight

WhiteBoardDom.width = WindowWdith
WhiteBoardDom.height = WindowHeight - OperatorDom.offsetHeight

window.onresize = () => {
	WindowWdith = document.body.offsetWidth
	WindowHeight = document.body.offsetHeight
	WhiteBoardDom.width = WindowWdith
	WhiteBoardDom.height = WindowHeight - OperatorDom.offsetHeight
}

function windowToCanvas(x, y) {
	// 将坐标转为相对canvas的坐标
	var cvsbox = WhiteBoardDom.getBoundingClientRect();
	return { x: Math.round(x - cvsbox.left), y: Math.round(y - cvsbox.top) };
}

const PerspectiveLine = {
	enabled: true,
	start: { x: 0, y: 0, has: false },
	end: { x: 0, y: 0 },
	extraEnd: { x: 0, y: 0, enabled: false },
	extraEndToggle(tog) {
		PerspectiveLine.extraEnd.enabled = typeof tog === 'boolean' ? tog : !PerspectiveLine.extraEnd.enabled
		if (!PerspectiveLine.extraEnd.enabled) {
			PerspectiveLine.extraEnd.x = 0
			PerspectiveLine.extraEnd.y = 0
		}
	},
	setExtraEnd(pos) {
		PerspectiveLine.extraEnd = {
			...pos,
			enabled: PerspectiveLine.extraEnd.enabled
		}
	},
	toggle() {
		PerspectiveLine.enabled = !PerspectiveLine.enabled
		PerspectiveLine.reset()
		refreshBoard()
	},
	reset() {
		PerspectiveLine.start = { x: 0, y: 0, has: false }
		PerspectiveLine.end = { x: 0, y: 0 }
	},
	moveStart(e) {
		if (PerspectiveLine.enabled) {
			if (PerspectiveLine.start.has) {
				WhiteBoardDom.removeEventListener('click', PerspectiveLine.moveStart)
				return
			}
			PerspectiveLine.start = { ...windowToCanvas(e.x, e.y), has: true }
		}
	},
	mousemove(e) {
		refreshBoard()
		if (PerspectiveLine.start.has && PerspectiveLine.enabled) {
			const pos = { ...(PerspectiveLine.extraEnd.enabled ? { x: PerspectiveLine.extraEnd.x, y: PerspectiveLine.extraEnd.y } : windowToCanvas(e.x, e.y)) }
			// 延长到边缘
			PerspectiveLine.end = pos
			// Context.clearRect(0, 0, WhiteBoardDom.offsetWidth, WhiteBoardDom.offsetHeight)
			Context.strokeStyle = 'red'
			Context.beginPath()
			Context.moveTo(PerspectiveLine.start.x - 10000, PerspectiveLine.start.y - 10000 * ((PerspectiveLine.end.y - PerspectiveLine.start.y) / (PerspectiveLine.end.x - PerspectiveLine.start.x)))
			Context.lineTo(PerspectiveLine.end.x, PerspectiveLine.end.y)
			Context.lineTo(PerspectiveLine.end.x + 10000, PerspectiveLine.end.y + 10000 * ((PerspectiveLine.end.y - PerspectiveLine.start.y) / (PerspectiveLine.end.x - PerspectiveLine.start.x)))
			Context.lineWidth = 1
			Context.closePath()
			Context.stroke()

			Context.fillStyle = "black"
			Context.beginPath()
			Context.arc(PerspectiveLine.start.x, PerspectiveLine.start.y, 2, 0, 2 * Math.PI)
			Context.closePath()
			Context.fill()

			Context.strokeStyle = 'red'
			Context.beginPath()
			Context.moveTo(0, PerspectiveLine.end.y)
			Context.lineTo(WhiteBoardDom.width, PerspectiveLine.end.y)
			Context.lineWidth = 0.1
			Context.closePath()
			Context.stroke()
			Context.strokeStyle = 'red'
			Context.beginPath()
			Context.moveTo(PerspectiveLine.end.x, 0)
			Context.lineTo(PerspectiveLine.end.x, PerspectiveLine.end.y)
			Context.lineTo(PerspectiveLine.end.x, WhiteBoardDom.height)
			Context.lineWidth = 0.1
			Context.closePath()
			Context.stroke()
		}
	}
}

const DrawerTools = {
	active: '',
	color: 'black',
	history: [],
	extraKey: '',
	points: [],
	overPoint: null,
	overRadius: 4,
	alignPoints: [],
	alignMousePoint: null,
	alignDistance: 8,

	undo() {
		let popItem = null
		if (DrawerTools.history.length > 0) {
			popItem = DrawerTools.history.pop()
		}
		DrawerTools.points = DrawerTools.points.filter((item, index) => {
			return index < DrawerTools.points.length - DrawerTools.tools[popItem.type].pointsNum
		})
		refreshBoard()
	},
	resetExtraKey() {
		DrawerTools.extraKey = ''
	},
	setExtraKey(key) {
		DrawerTools.extraKey = key
	},
	autoAlignPoint(_e) {
		DrawerTools.alignPoints = []
		DrawerTools.alignMousePoint = { ..._e }
		for (let i = 0; i < DrawerTools.points.length; i++) {
			const p = DrawerTools.points[i]
			const xClose = Math.abs(p.x - _e.x) < DrawerTools.alignDistance
			const yClose = Math.abs(p.y - _e.y) < DrawerTools.alignDistance
			if (xClose || yClose) {
				Context.fillStyle = "black"
				Context.beginPath()
				Context.arc(p.x, p.y, DrawerTools.overRadius, 0, 2 * Math.PI)
				Context.closePath()
				Context.fill()
				DrawerTools.alignPoints.push(p)
				if (xClose) {
					Context.strokeStyle = 'green'
					Context.beginPath()
					Context.moveTo(p.x, -10000)
					Context.lineTo(p.x, 10000)
					Context.lineWidth = 0.1
					Context.closePath()
					Context.stroke()
					DrawerTools.alignMousePoint = { x: p.x, y: DrawerTools.alignMousePoint.y }
				}
				if (yClose) {
					Context.strokeStyle = 'green'
					Context.beginPath()
					Context.moveTo(-10000, p.y)
					Context.lineTo(10000, p.y)
					Context.lineWidth = 0.1
					Context.closePath()
					Context.stroke()
					DrawerTools.alignMousePoint = { x: DrawerTools.alignMousePoint.x, y: p.y }
				}
				// const b1 = Math.abs(p.y - PerspectiveLine.start.y)
				// const b2 = Math.abs(p.x - PerspectiveLine.start.x)
				// const t1 = Math.abs(_e.y - PerspectiveLine.start.y)
				// const t2 = Math.abs(_e.x - PerspectiveLine.start.x)
				// const alpha = b1 / b2
				// const beta = t1 / t2
				// const PerspectiveAngle = Math.abs((alpha - beta) / (1 + alpha * beta))
				// const k = (p.y - PerspectiveLine.start.y) / (p.x - PerspectiveLine.start.x)
				// const b = p.y - k * p.x
				// const perspectiveDistance = Math.abs(k * _e.x - _e.y + b) / Math.sqrt(k * k + 1)
				// // const perspectiveClose = PerspectiveAngle < 0.12
				// const perspectiveClose = perspectiveDistance < DrawerTools.alignDistance * 3
				// if (perspectiveClose) {
				// 	if (xClose) {
				// 		const staticY = DrawerTools.alignMousePoint.y
				// 		const x = (staticY - b) / k
				// 		DrawerTools.alignMousePoint = { x: x, y: staticY }
				// 	}
				// 	if (yClose) {
				// 		const staticX = DrawerTools.alignMousePoint.x
				// 		const y = k * staticX + b
				// 		DrawerTools.alignMousePoint = { x: staticX, y: y }
				// 	}
				// 	Context.strokeStyle = 'red'
				// 	Context.beginPath()
				// 	Context.moveTo(PerspectiveLine.start.x - 10000, PerspectiveLine.start.y - 10000 * ((DrawerTools.alignMousePoint.y - PerspectiveLine.start.y) / (DrawerTools.alignMousePoint.x - PerspectiveLine.start.x)))
				// 	Context.lineTo(DrawerTools.alignMousePoint.x, DrawerTools.alignMousePoint.y)
				// 	Context.lineTo(DrawerTools.alignMousePoint.x + 10000, DrawerTools.alignMousePoint.y + 10000 * ((DrawerTools.alignMousePoint.y - PerspectiveLine.start.y) / (DrawerTools.alignMousePoint.x - PerspectiveLine.start.x)))
				// 	Context.lineWidth = 0.1
				// 	Context.closePath()
				// 	Context.stroke()
				// }
				// break
			}
		}
	},
	drawHistory() {
		DrawerTools.history.forEach(item => DrawerTools.tools[item.type].draw(item))
	},
	selectPoint(e) {
		const _e = { ...windowToCanvas(e.x, e.y) }
		DrawerTools.overPoint = null
		for (let i = 0; i < DrawerTools.points.length; i++) {
			const p = DrawerTools.points[i]
			if (Math.abs(p.x - _e.x) < DrawerTools.overRadius && Math.abs(p.y - _e.y) < DrawerTools.overRadius) {
				Context.fillStyle = "black"
				Context.beginPath()
				Context.arc(p.x, p.y, DrawerTools.overRadius, 0, 2 * Math.PI)
				Context.closePath()
				Context.fill()
				DrawerTools.overPoint = p
				break
			}
		}
	},
	tools: {
		line: {
			pointsNum: 2,
			pointsBuffer: [],
			reset() {
				if (DrawerTools.tools.line.pointsBuffer.length === 1) {
					DrawerTools.tools.line.pointsBuffer = []
					refreshBoard()
				}
			},
			draw({ sPoint, ePoint, color = DrawerTools.color }) {
				if (!sPoint) return
				// Context.clearRect(0, 0, WhiteBoardDom.offsetWidth, WhiteBoardDom.offsetHeight)
				Context.strokeStyle = color
				Context.beginPath()
				Context.moveTo(sPoint.x, sPoint.y)
				Context.lineTo(ePoint.x, ePoint.y)
				Context.lineWidth = 1
				Context.closePath()
				Context.stroke()

				Context.fillStyle = "black"
				Context.beginPath()
				Context.arc(sPoint.x, sPoint.y, 2, 0, 2 * Math.PI)
				Context.closePath()
				Context.fill()
				Context.fillStyle = "black"
				Context.beginPath()
				Context.arc(ePoint.x, ePoint.y, 2, 0, 2 * Math.PI)
				Context.closePath()
				Context.fill()
			},
			click(e) {
				DrawerTools.tools.line.pointsBuffer.push({ ...(DrawerTools.overPoint || DrawerTools.alignMousePoint || windowToCanvas(e.x, e.y)) })
				if (DrawerTools.tools.line.pointsBuffer.length === 2) {
					DrawerTools.points.push(DrawerTools.tools.line.pointsBuffer[0])
					DrawerTools.points.push(DrawerTools.tools.line.pointsBuffer[1])
					DrawerTools.history.push({
						type: 'line',
						sPoint: DrawerTools.tools.line.pointsBuffer[0],
						ePoint: DrawerTools.tools.line.pointsBuffer[1],
						color: DrawerTools.color
					})
					DrawerTools.tools.line.pointsBuffer = []
					refreshBoard()
				}
			},
			mousemove(e) {
				PerspectiveLine.extraEndToggle(false)
				DrawerTools.autoAlignPoint(windowToCanvas(e.x, e.y))
				Context.fillStyle = "black"
				Context.beginPath()
				Context.arc(DrawerTools.alignMousePoint.x, DrawerTools.alignMousePoint.y, 2, 0, 2 * Math.PI)
				Context.closePath()
				Context.fill()
				if (DrawerTools.tools.line.pointsBuffer.length === 1) {
					const sPoint = DrawerTools.tools.line.pointsBuffer[0]
					const ePoint = { ...(DrawerTools.alignMousePoint) }
					DrawerTools.tools.line.draw({ sPoint, ePoint })
				}
			},
			getPerspectiveEndPoint(e) {
				if (DrawerTools.tools.line.pointsBuffer.length === 1) {
					const _e = { ...(windowToCanvas(e.x, e.y)) }
					const sPoint = DrawerTools.tools.line.pointsBuffer[0]
					// const b1 = Math.abs(_e.y - sPoint.y)
					// const b2 = Math.abs(_e.x - sPoint.x)
					// const t1 = Math.abs(_e.y - PerspectiveLine.start.y)
					// const t2 = Math.abs(_e.x - PerspectiveLine.start.x)
					// const alpha = b1 / b2
					// const beta = t1 / t2
					// const PerspectiveAngle = Math.abs((alpha - beta) / (1 + alpha * beta))
					// 对齐透视线
					// if (PerspectiveAngle <= 0.36) {
					const ePoint = { x: _e.x, y: null }
					const k = (sPoint.y - PerspectiveLine.start.y) / (sPoint.x - PerspectiveLine.start.x)
					const b = sPoint.y - k * sPoint.x
					ePoint.y = ePoint.x * k + b
					DrawerTools.autoAlignPoint(ePoint)
					return { sPoint, ePoint: ePoint }
					// }
				}
				return false
			},
			getStandardEndPoint(e) {
				if (DrawerTools.tools.line.pointsBuffer.length === 1) {
					DrawerTools.autoAlignPoint(windowToCanvas(e.x, e.y))
					const _e = { ...DrawerTools.alignMousePoint }
					const sPoint = DrawerTools.tools.line.pointsBuffer[0]
					const b1 = Math.abs(_e.y - sPoint.y)
					const b2 = Math.abs(_e.x - sPoint.x)
					const alpha = b1 / b2
					// 对齐垂直线
					if (alpha <= 1) {
						return {
							sPoint,
							ePoint: { x: _e.x, y: sPoint.y }
						}
					}
					// 对齐水平线
					if (1 / alpha < 1) {
						return {
							sPoint,
							ePoint: { x: sPoint.x, y: _e.y }
						}
					}
				}
				return false
			},
			extra: {
				ShiftLeft_keydown: {
					mousemove(e) {
						const lineEndPoints = DrawerTools.tools.line.getStandardEndPoint(e)
						if (lineEndPoints) {
							PerspectiveLine.extraEndToggle(true)
							DrawerTools.tools.line.draw(lineEndPoints)
							PerspectiveLine.setExtraEnd(lineEndPoints.ePoint)
						}
					},
					click(e) {
						const { ePoint = null } = DrawerTools.tools.line.getStandardEndPoint(e)
						if (ePoint) {
							DrawerTools.tools.line.pointsBuffer.push(ePoint)
							if (DrawerTools.tools.line.pointsBuffer.length === 2) {
								DrawerTools.points.push(DrawerTools.tools.line.pointsBuffer[0])
								DrawerTools.points.push(DrawerTools.tools.line.pointsBuffer[1])
								DrawerTools.history.push({
									type: 'line',
									sPoint: DrawerTools.tools.line.pointsBuffer[0],
									ePoint: DrawerTools.tools.line.pointsBuffer[1],
									color: DrawerTools.tools.color
								})
								DrawerTools.tools.line.pointsBuffer = []
								refreshBoard()
							}
						} else {
							DrawerTools.tools.line.pointsBuffer.push({ ...windowToCanvas(e.x, e.y) })
						}
					}
				},
				ShiftLeft_keydown_ControlLeft_keydown: {
					mousemove(e) {
						if (PerspectiveLine.enabled) {
							const lineEndPoints = DrawerTools.tools.line.getPerspectiveEndPoint(e)
							if (lineEndPoints) {
								PerspectiveLine.extraEndToggle(true)
								DrawerTools.tools.line.draw(lineEndPoints)
								PerspectiveLine.setExtraEnd(lineEndPoints.ePoint)
							}
							return
						}
						DrawerTools.tools.line.mousemove(e)
					},
					click(e) {
						if (PerspectiveLine.enabled) {
							const { ePoint = null } = DrawerTools.tools.line.getPerspectiveEndPoint(e)
							if (ePoint) {
								DrawerTools.tools.line.pointsBuffer.push(ePoint)
								if (DrawerTools.tools.line.pointsBuffer.length === 2) {
									DrawerTools.points.push(DrawerTools.tools.line.pointsBuffer[0])
									DrawerTools.points.push(DrawerTools.tools.line.pointsBuffer[1])
									DrawerTools.history.push({
										type: 'line',
										sPoint: DrawerTools.tools.line.pointsBuffer[0],
										ePoint: DrawerTools.tools.line.pointsBuffer[1],
										color: DrawerTools.tools.color
									})
									DrawerTools.tools.line.pointsBuffer = []
									refreshBoard()
								}
							} else {
								DrawerTools.tools.line.pointsBuffer.push({ ...windowToCanvas(e.x, e.y) })
							}
							return
						}
						DrawerTools.tools.line.click(e)
					}
				}
			}
		}
	}
}

function BoardClick(e) {
	PerspectiveLine.moveStart(e)
	if (DrawerTools.active) {
		if (DrawerTools.extraKey &&
			DrawerTools.tools[DrawerTools.active].extra[DrawerTools.extraKey] &&
			DrawerTools.tools[DrawerTools.active].extra[DrawerTools.extraKey].click) {
			DrawerTools.tools[DrawerTools.active].extra[DrawerTools.extraKey].click(e)
		} else {
			DrawerTools.tools[DrawerTools.active].click(e)
		}
	}
}

function BoardMove(e) {
	PerspectiveLine.mousemove(e)
	DrawerTools.selectPoint(e)
	if (DrawerTools.active) {
		if (DrawerTools.extraKey &&
			DrawerTools.tools[DrawerTools.active].extra[DrawerTools.extraKey] &&
			DrawerTools.tools[DrawerTools.active].extra[DrawerTools.extraKey].mousemove) {
			DrawerTools.tools[DrawerTools.active].extra[DrawerTools.extraKey].mousemove(e)
		} else {
			DrawerTools.tools[DrawerTools.active].mousemove(e)
		}
	}
}

function refreshBoard() {
	Context.clearRect(0, 0, WhiteBoardDom.offsetWidth, WhiteBoardDom.offsetHeight)
	DrawerTools.drawHistory()
}

WhiteBoardDom.addEventListener('mousemove', BoardMove)

const Operator = {
	Perspective: {
		Dom: document.getElementById('Perspective'),
		Init() {
			Operator.Perspective.Dom.innerHTML = PerspectiveLine.enabled ? '关闭透视辅助' : '开启透视辅助'
		},
		listener: {
			click(e) {
				DrawerTools.active = ''
				PerspectiveLine.toggle()
				InitOperator()
			}
		}
	},
	Reset: {
		Dom: document.getElementById('Reset'),
		Init() {
			Operator.Reset.Dom.style.display = PerspectiveLine.enabled ? 'block' : 'none'
			PerspectiveLine.reset()
			WhiteBoardDom.addEventListener('click', BoardClick)
		},
		listener: {
			click(e) {
				refreshBoard()
				Operator.Reset.Init()
			}
		}
	},
	Line: {
		Dom: document.getElementById('Line'),
		Init() {
			// Operator.Line.Dom.disabled = !PerspectiveLine.start.has && PerspectiveLine.enabled
		},
		listener: {
			click(e) {
				if (PerspectiveLine.start.has || !PerspectiveLine.enabled) {
					DrawerTools.active = 'line'
				} else {
					alert('请先确定透视消失点')
				}
			}
		}
	}
}

function InitOperator(initListener = false) {
	for (let key in Operator) {
		Operator[key].Init()
		if (initListener) {
			for (let lkey in Operator[key].listener) {
				Operator[key].Dom.addEventListener(lkey, Operator[key].listener[lkey])
			}
		}
	}
}

InitOperator(true)

const KeyboardTools = {
	currentMixKey: '',
	mixingKeys: {},
	toggleValueMap: {
		1: true,
		2: false
	},
	getDrawerExtraKey(e) {
		if (KeyboardTools.currentMixKey) return KeyboardTools.currentMixKey
		return `${e.code}_${e.type}`
	},
	keys: {
		ShiftLeft: {
			code: 'ShiftLeft',
			enabled: false,
			status: 'keyup',
			toggleType: { keydown: 1, keyup: 2 },
			statusController(e) {
				if (e.code === 'ShiftLeft') {
					KeyboardTools.keys[e.code].status = e.type
					KeyboardTools.mixingKeys[e.code] = e.type
				}
			},
			toggle(e) {
				const toggleValue = KeyboardTools.keys.ShiftLeft.toggleType[e.type] || false
				if (toggleValue && e.code === 'ShiftLeft') {
					KeyboardTools.keys.ShiftLeft.enabled = KeyboardTools.toggleValueMap[toggleValue]
				}
			},
			listener: {
				keydown(e) {
					e.preventDefault()
					KeyboardTools.keys.ShiftLeft.toggle(e)
				},
				press(e) {
					e.preventDefault()
				},
				keyup(e) {
					e.preventDefault()
					KeyboardTools.keys.ShiftLeft.toggle(e)
				}
			}
		},
		ControlLeft: {
			code: 'ControlLeft',
			enabled: false,
			status: 'keyup',
			toggleType: { keydown: 1, keyup: 2 },
			statusController(e) {
				if (e.code === 'ControlLeft') {
					KeyboardTools.keys[e.code].status = e.type
					KeyboardTools.mixingKeys[e.code] = e.type
				}
			},
			toggle(e) {
				const toggleValue = KeyboardTools.keys.ControlLeft.toggleType[e.type] || false
				if (toggleValue && e.code === 'ControlLeft') {
					KeyboardTools.keys.ControlLeft.enabled = KeyboardTools.toggleValueMap[toggleValue]
				}
			},
			listener: {
				keydown(e) {
					e.preventDefault()
					KeyboardTools.keys.ControlLeft.toggle(e)
				},
				press(e) {
					e.preventDefault()
				},
				keyup(e) {
					e.preventDefault()
					KeyboardTools.keys.ControlLeft.toggle(e)
				}
			}
		},
		KeyZ: {
			code: 'KeyZ',
			enabled: false,
			status: 'keyup',
			toggleType: { keydown: 1, keyup: 2 },
			statusController(e) {
				if (e.code === 'KeyZ') {
					KeyboardTools.keys[e.code].status = e.type
					KeyboardTools.mixingKeys[e.code] = e.type
				}
			},
			toggle(e) {
				const toggleValue = KeyboardTools.keys.KeyZ.toggleType[e.type] || false
				if (toggleValue && e.code === 'KeyZ') {
					KeyboardTools.keys.KeyZ.enabled = KeyboardTools.toggleValueMap[toggleValue]
				}
			},
			listener: {
				keydown(e) {
					e.preventDefault()
					KeyboardTools.keys.KeyZ.toggle(e)
				},
				press(e) {
					e.preventDefault()
				},
				keyup(e) {
					e.preventDefault()
					KeyboardTools.keys.KeyZ.toggle(e)
				}
			}
		},
		MouseRight: {
			code: 'MouseRight',
			enabled: false,
			status: 'keyup',
			toggleType: { contextmenu: 1 },
			statusController(e) {
				if (e.code === 'MouseRight') {
					KeyboardTools.keys[e.code].status = e.type
					KeyboardTools.mixingKeys[e.code] = e.type
				}
			},
			toggle(e) {
				const toggleValue = KeyboardTools.keys.MouseRight.toggleType[e.type] || false
				if (toggleValue && e.code === 'MouseRight') {
					KeyboardTools.keys.MouseRight.enabled = KeyboardTools.toggleValueMap[toggleValue]
				}
			},
			listener: {
				contextmenu(e) {
					e.preventDefault()
					KeyboardTools.keys.MouseRight.toggle(e)
					if (DrawerTools.active) DrawerTools.tools[DrawerTools.active].reset()
				},
			}
		},
	},
	resetMixKey(e) {
		KeyboardTools.currentMixKey = ''
	},
	mixKeys: {
		ShiftLeft_keydown_ControlLeft_keydown: {
			includes: {
				ShiftLeft: 'keydown',
				ControlLeft: 'keydown',
			},
			statusController(e) {
				KeyboardTools.currentMixKey = 'ShiftLeft_keydown_ControlLeft_keydown'
			},
			event(e) {
			}
		},
		ControlLeft_keydown_KeyZ_keydown: {
			includes: {
				ControlLeft: 'keydown',
				KeyZ: 'keydown',
			},
			statusController(e) {
				KeyboardTools.currentMixKey = 'ControlLeft_keydown_KeyZ_keydown'
			},
			event(e) {
				DrawerTools.undo()
			}
		},
	},
}

function KeyboardListenerCallback(e) {
	// console.log(e)
	KeyboardTools.resetMixKey(e)
	DrawerTools.resetExtraKey()
	for (let code in KeyboardTools.keys) {
		if (e.code === code) {
			KeyboardTools.keys[code].statusController(e)
			KeyboardTools.keys[code].listener[e.type](e)
			break
		}
	}
	let triggerMixKey = null
	let triggerMixKeyNum = 0
	for (let mixkey in KeyboardTools.mixKeys) {
		const { includes } = KeyboardTools.mixKeys[mixkey]
		let isCurMix = true
		let _triggerMixKeyNum = 0
		for (let key in includes) {
			isCurMix = isCurMix && KeyboardTools.mixingKeys[key] === includes[key]
			if (!isCurMix) break
			_triggerMixKeyNum++
		}
		if (isCurMix) {
			if (_triggerMixKeyNum > triggerMixKeyNum) {
				triggerMixKey = mixkey
				triggerMixKeyNum = _triggerMixKeyNum
			}
		}
	}
	if (triggerMixKey && KeyboardTools.mixKeys[triggerMixKey]) {
		KeyboardTools.mixKeys[triggerMixKey].statusController(e)
		KeyboardTools.mixKeys[triggerMixKey].event(e)
	}
	DrawerTools.setExtraKey(KeyboardTools.getDrawerExtraKey(e))
}
window.addEventListener('keydown', KeyboardListenerCallback)
window.addEventListener('keyup', KeyboardListenerCallback)
window.addEventListener('press', KeyboardListenerCallback)
window.addEventListener('contextmenu', (e) => {
	e.code = 'MouseRight'
	KeyboardListenerCallback(e)
})

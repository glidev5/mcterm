--[[Copyright PrinceTommen - Script developed for CyanideEpic (twitch.tv/cyanideepic)]]--
--[[You are all allowed to use it as long as you don't pretend it's yours]]--
--[[Have fun !]]--
version =" 3.5"
--[[
Release Note:
3.5:	Added:	Multiple item slots system, including the items to throw (suggested by Portsanta and CyanideEpic)
		Major interface enhancements to make the configuration faster in spite of the new options
		Enhanced item shortage security, supporting the multiple slots
		New functions to manage I/O in a more compact way (suggested by Niseg)
3.41:	Fixed:	Important glitch when the turtle returned to its starting position with a certain configuration
		Displaying issues
3.4:	Added:	Favorite configuration system
		Ability to choose the direction of the series of parallel tunnels (right or left)
		Support of execution without torches or chests (will not try to place them)
		Security that stops the turtle when it runs out of chests or torches (suggested by CyanideEpic)
		Chests and torches status updated automatically
		Security that requires the user to press enter before the turtle starts (suggested by CyanideEpic)
		The turtle now returns to its starting position after it finishes
		New rotation function as well a a specific torch placing function
	Fixed:	The turtle will now properly finish the hub after mining an odd number of tunnels	
		The torch placement has been modified to avoid conflicts with chests
3.3:	Added:	Enderchest Support (suggested by Niseg and Daniteh)
		Release note
3.2:	Fixed:	Very important chest placing issue (only appeared in 3.1)
3.1:	Added:	New mining pattern for more efficiency (suggested by Niseg)
		Smarter fuel management:	Will now consume the "stored" fuel before refueling
						Can now consume any type of fuel supported by turtles (check the wiki)
						Fuel type can be changed while the turtle is mining
		Optimized the mining of 3 blocks high tunnels
		Better interface, instructions remain visible and a line is dedicated to the fuel status (updated automatically)
		Option to throw cobblestone automatically (suggested by Niseg)
	Fixed:	Refueling issue in certain circumstances (reported by CyanideEpic)			
]]--
function resetScreen()
	term.clear()
	term.setCursorPos(14,1)
	write("Mining Turtle")
	term.setCursorPos(5,2)
	write("For CyanideEpic and his friends")
	term.setCursorPos(1,13)
	write("By PrinceTommen, version "..version)
	term.setCursorPos(1,4)
end	  
function textOutput(output_message, x_screen_pos, z_screen_pos, clear_area)
	term.setCursorPos(x_screen_pos,z_screen_pos)
	if clear_area == 0 then
		clear_area = string.len(output_message)
	end	
	write(output_message..string.rep(" ", (clear_area - string.len(output_message))))
end
function securedInput(x_screen_pos, z_screen_pos, nature, lower_value, upper_value, example1, example2)
	example = {example1, example2}
	local function shortExample(example_int, example, boolStringPart)
		tableShortExample = {}
		tableShortExample[example_int] = example[example_int].." ("..string.sub(string.lower(example[example_int]), 1, 1)..") "
		if boolStringPart then
			return string.sub(string.lower(example[example_int]), 1, 1) 
		else
			return tableShortExample[example_int]
		end	
	end
	incipit = shortExample(1, example, false).."/ "..shortExample(2, example, false)..": "
	if nature == "text" then
		repeat
			textOutput(incipit, x_screen_pos, z_screen_pos, 39)
			term.setCursorPos(string.len(incipit)+1,z_screen_pos)	
			user_input = string.sub(string.lower(read()), 1, 1)
		until (user_input == shortExample(1, example, true) or user_input == shortExample(2, example, true))
	elseif nature == "integer" then
		repeat
			textOutput(" ", x_screen_pos, z_screen_pos, (39 - x_screen_pos))
			term.setCursorPos(x_screen_pos,z_screen_pos)
			user_input = tonumber(read())	
		until (user_input >= lower_value and user_input <= upper_value)
	end	
	return user_input
end
function clearLines(firstLine, lastLine)
	a = 1
	for a=1, (lastLine-firstLine+1) do
		textOutput("", 1, (firstLine+a-1), 40)
	end
end
function convertToBool(var, boolTrue)
	if var == boolTrue then
		var = true
	else
		var = false
	end
	return var
end
function turn(FacingAngle, Bool_rotation, Rotation_integer)
	if Bool_rotation then
		for u=1, Rotation_integer do
			turtle.turnRight()
		end
		FacingAngle = FacingAngle + Rotation_integer
	else
		for u=1, Rotation_integer do
			turtle.turnLeft()
		end
		FacingAngle = FacingAngle - Rotation_integer
	end
	FacingAngle = math.abs((FacingAngle - 1)%4+1)
	return FacingAngle
end
local function refuel()
	turtle.select(torches_slots+current_slot[2])
	while not(turtle.refuel(1)) do
		for f=1, fuel_slots do
			current_slot[2], shortage[2] = rotateSlot(2, torches_slots+1, fuel_slots)
			turtle.select(torches_slots+current_slot[2])
			if turtle.refuel(1) then
				boolRefuel = true
				break
			else
				boolRefuel = false
			end
		end
		if not(boolRefuel) then
			textOutput("No Fuel -", 1, 11, 0)
			current_slot[2], shortage[2] = manageShortage(2, torches_slots+1, torches_slots+fuel_slots) 
		end
	end
	refuel_count = 80 - turtle.getFuelLevel()
	textOutput("Fuel OK -", 1, 11, 0)
	return refuel_count  
end
function moveForward(FacingAngle, Boolfb, moving_integer, digUpBool, digDownBool, refuel_count)
	local moving_count = 1
	for moving_count=1,moving_integer do
		if (refuel_count == 80) then
			refuel_count = refuel()
		end
		Bool1 = false
		while not(Bool1) do
			if (Boolfb) then
				turtle.dig()
				Bool1 = turtle.forward()
				if (digUpBool) then
					turtle.digUp()
				end
				if (digDownBool) then
					turtle.digDown()
				end  
			else
				Bool1 = turtle.back()
				if not(Bool1) then
					turn(FacingAngle, true, 2)
					turtle.dig()
					turn(FacingAngle, false, 2)
				end
			end    
		end
		moving_count = moving_count + 1
		refuel_count = refuel_count + 1
	end 
	return refuel_count  
end
function moveUp(Boolud, moving_integer, refuel_count, Bool_DigFront)
	local moving_count = 1
	for moving_count=1, moving_integer do
		if (refuel_count == 80) then
			refuel_count = refuel()
		end
		Bool2 = false
		if Bool_DigFront then
			turtle.dig()
		end
		while not(Bool2) do
			if (Boolud) then
				turtle.digUp()   
				Bool2 = turtle.up()
			else
				turtle.digDown()
				Bool2 = turtle.down()
			end
		end
		moving_count = moving_count + 1
		refuel_count = refuel_count + 1
	end
	return refuel_count
end
function manageShortage(managedItem, initial_item_slot, final_item_slot)
	textOutput("The turtle has used all the "..(itemNames[managedItem+3]).." intitially given. Have you refilled all the "..(itemNames[managedItem+3]).." slots ?", 1, 4, 0)
	textOutput("Press enter if all the "..(itemNames[managedItem+3]).." slots are refilled (slots "..(initial_item_slot).." to "..(final_item_slot)..").", 1, 7, 0)
	repeat
		turn(FacingAngle, true, 4)
		os.startTimer(1)
		press, key = os.pullEvent()
	until (key == 28)
	clearLines(4,10)
	current_slot[managedItem] = 1
	shortage[managedItem] = false
	return current_slot[managedItem], shortage[managedItem]
end
function rotateSlot(managedItem, control_slot, rotation_controler)
	if (turtle.getItemCount(control_slot) == 0) or (managedItem == 2) then			
		if current_slot[managedItem]==rotation_controler and (managedItem ~= 2) then
			shortage[managedItem] = true
		else
			current_slot[managedItem]=((current_slot[managedItem])%rotation_controler)+1
		end
	end
	return current_slot[managedItem], shortage[managedItem]
end					
function inventoryManagement(refuel_count,Right_or_Left,throw_cobble)
	function fullInventory(n)
		n = m + 1
		repeat
			item_count = turtle.getItemCount(n)
			if (item_count ~= 0) then          
				boolSlotOccupied = true
				n = n + 1  
			else
				boolSlotOccupied = false  
			end  
		until (boolSlotOccupied == false) or (n == 17)
		return n
	end
	if Chest_approval then
		m = torches_slots + chests_slots + fuel_slots + garbage_slots
		thrown_slots = 0
		if (turtle.getItemCount(16) ~= 0) and (m~=16) then
			if fullInventory(m)==17 then
				if throw_stuff then
					for k=1, garbage_slots do
						for j=1, (16-m) do
							turtle.select(m - garbage_slots + k)
							Bool_match_stuff = turtle.compareTo(m+j)
							if Bool_match_stuff then
								thrown_slots = thrown_slots + 1
								turtle.select(m+j)
								turtle.drop()	 
							end
						end
						turtle.select(m - garbage_slots + k)
						turtle.drop(turtle.getItemCount(m - garbage_slots + k)-1)
					end	
					for z = (m+1), 16 do
						for u = (z+1), 16 do
							if turtle.getItemCount(u)~=0 then
								turtle.select(u)
								turtle.transferTo(z)
							end
						end
					end
				end
				if not(throw_stuff) or ((thrown_slots <= 2) and (fullInventory(n)>15)) then
					if shortage[3] then
						textOutput("No Chests", 24, 11, 0)
						current_slot[3], shortage[3] = manageShortage(3, torches_slots+fuel_slots+1, torches_slots+fuel_slots+chests_slots)
					end
					textOutput("Chests OK", 24, 11, 0)
					if (Right_or_Left == "left") then
						FacingAngle = turn(FacingAngle, true, 1)
					else
						FacingAngle = turn(FacingAngle, false, 1)
					end  
					refuel_count = moveForward(FacingAngle, true, 1, false, true, refuel_count)
					turtle.select(torches_slots+fuel_slots+current_slot[3])
					turtle.digDown()
					turtle.placeDown()
					for u=(m+1),16 do
						if turtle.getItemCount(u)~=0 then
							turtle.select(u)
							turtle.dropDown()
						end
					end
					if enderchest then
						turtle.select(torches_slots+fuel_slots+1)
						turtle.drop()
						turtle.digDown()
					end
					current_slot[3], shortage[3] = rotateSlot(3, torches_slots+fuel_slots+current_slot[3], chests_slots)
					refuel_count = moveForward(FacingAngle, false, 1, false, false, refuel_count)
					if (Right_or_Left == "left") then
						FacingAngle = turn(FacingAngle, false, 1)
					else
						FacingAngle = turn(FacingAngle, true, 1)
					end
				end	  
			end
		end
	end
	turtle.select(1)
	return refuel_count  
end
function placeTorch(Position)
	if Torch_approval then
		if shortage[1] then
			textOutput("No Torches -", 11, 11, 0)
			current_slot[1], shortage[1] = manageShortage(1, 1, torches_slots) 
		end
		textOutput("Torches OK -", 11, 11, 0)
		turtle.select(current_slot[1])
		if Position == "front" then
			turtle.dig()
			turtle.place()
		elseif Position ==	"below" then
			turtle.digDown()
			turtle.placeDown()
		elseif Position == "up" then
			turtle.digUp()
			turtle.placeUp()
		end
		current_slot[1], shortage[1] = rotateSlot(1, current_slot[1], torches_slots)
	end
end
function digVerticalLayer(refuel_count, FacingAngle, Width, Height, Height_Position, Bool_Torches, Right_or_Left)
	if Right_or_Left then
		Right_or_Left = "left"
	else
		Right_or_Left = "right"
	end	
	done_columns = 0
	if (Height_Position == "up") then
		for columns=1, math.floor(Width/4) do
			turtle.digUp()
			if (Height > 3) then
				refuel_count = moveUp(true, 1, refuel_count, false)
				turtle.dig()
				refuel_count = moveUp(false, (Height-2), refuel_count, true)
				turtle.digDown()
			end
			refuel_count = moveForward(FacingAngle, true, 2, true, true, refuel_count)
			refuel_count = inventoryManagement(refuel_count, Right_or_Left, throw_cobble)
			if (Height > 3) then
				refuel_count = moveUp(false, 1, refuel_count, false)
				turtle.dig()
				refuel_count = moveUp(true, (Height-2), refuel_count, true)
				turtle.digUp()
			end
			refuel_count = moveForward(FacingAngle, true, 1, true, true, refuel_count)
			done_columns = done_columns + 1
			if (Width - 4*done_columns ~= 0) then
				refuel_count = moveForward(FacingAngle, true, 1, true, true, refuel_count)
			end
		end  
		if ((Width - 4*math.floor(Width/4)) == 0) then
			Height_Position = "up"
		elseif ((Width - 4*math.floor(Width/4)) == 1) then
			turtle.digUp()
			refuel_count = moveUp(false, (Height-3), refuel_count, false)
			turtle.digDown()
			refuel_count = inventoryManagement(refuel_count, Right_or_Left, throw_cobble)
			Height_Position = "down"
		elseif ((Width - 4*math.floor(Width/4)) >= 2) then
			if (Height > 3) then
				refuel_count = moveUp(true, 1, refuel_count, false)
				turtle.dig()
				refuel_count = moveUp(false, (Height-2), refuel_count, true)
				turtle.digDown()
			end
			turtle.digUp()
			refuel_count = moveForward(FacingAngle, true, 1, true, true, refuel_count)
			refuel_count = inventoryManagement(refuel_count, Right_or_Left, throw_cobble)
			Height_Position = "down"
			if ((Width - 4*math.floor(Width/4)) == 3) then
				refuel_count = moveForward(FacingAngle, true, 1, true, true, refuel_count)
				refuel_count = moveUp(true, (Height - 3), refuel_count, false)
				turtle.digUp()
				Height_Position = "up"
			end
		end	
	elseif (Height_Position == "down") then
		for columns=1, math.floor(Width/4) do
			turtle.digDown()
			if (Height > 3) then
				refuel_count = moveUp(false, 1, refuel_count, false)
				turtle.dig()
				refuel_count = moveUp(true, (Height - 2), refuel_count, true)
				turtle.digUp()
			end
			refuel_count = moveForward(FacingAngle, true, 2, true, true, refuel_count)
			if (Height > 3) then
				refuel_count = moveUp(true, 1, refuel_count, false)
				turtle.dig()
				refuel_count = moveUp(false, (Height - 2), refuel_count, true)
				turtle.digDown()
			end
			refuel_count = moveForward(FacingAngle, true, 1, true, true, refuel_count)
			done_columns = done_columns + 1
			if (Width - 4*done_columns ~= 0) then
				refuel_count = moveForward(FacingAngle, true, 1, true, true, refuel_count)
			end
			refuel_count = inventoryManagement(refuel_count, Right_or_Left, throw_cobble)
			if (done_columns%2 == 0) and Bool_Torches then
				FacingAngle = turn(FacingAngle,true , 1)
				placeTorch("front")
				FacingAngle = turn(FacingAngle, false, 1)
			end
		end
		if ((Width - 4*math.floor(Width/4)) == 0) then
			Height_Position = "down"
		elseif ((Width - 4*math.floor(Width/4)) == 1) then
			turtle.digDown()	  
			refuel_count = moveUp(true, (Height - 3), refuel_count, false)
			turtle.digUp()
			Height_Position = "up"
		elseif ((Width - 4*math.floor(Width/4)) >= 2) then
			if (Height > 3) then
				refuel_count = moveUp(false, 1, refuel_count, false)
				turtle.dig()	  
				refuel_count = moveUp(true, (Height - 2), refuel_count, true)
				turtle.digUp()
			end
			turtle.digDown()
			refuel_count = moveForward(FacingAngle, true, 1, true, true, refuel_count)
			Height_Position = "up"
			if ((Width - 4*math.floor(Width/4)) == 3) then
				refuel_count = moveForward(FacingAngle, true, 1, true, true, refuel_count)
				refuel_count = moveUp(false, (Height - 3), refuel_count, false)
				turtle.digDown()
				refuel_count = inventoryManagement(refuel_count, Right_or_Left, throw_cobble)
				Height_Position = "down"
			end		
		end  	  
	end
	return refuel_count, Height_Position	  
end

enderchest, throw_stuff, Chest_approval, Torch_approval, Chest_mismatch, Torch_mismatch = false, false, false, false, false, false
shortage, itemNames = {false, false, false}, {"torch", "fuel", "chest", "torches", "fuel", "chests"}

resetScreen()
if (io.open("favorite", "r") ~= nil) then
		resetScreen()
		textOutput("Do you wish to use your favorite configuration ?", 1, 4, 0)
		Favorite_approval = securedInput(1, 6, "text", 0, 0, "Yes", "No")
	if (Favorite_approval == "y") then
		handle = fs.open("favorite", "r")
		input = handle.readAll()
		handle.close()
		favorite = textutils.unserialize(input)
		tunnels_integer = favorite.tunnels_integer
		Width = favorite.Width
		Height = favorite.Height
		Length = favorite.Length
		tunnels_separation = favorite.tunnels_separation
		throw_stuff = favorite.throw_stuff
		enderchest = favorite.enderchest
		Torch_approval = favorite.Torch_approval
		Chest_approval = favorite.Chest_approval
	end
end	
if (io.open("favorite", "r") == nil) or ((io.open("favorite", "r") ~= nil) and (Favorite_approval == "n")) then
	resetScreen()
	textOutput("Number of parallel tunnels ? ", 1, 4, 0)
	tunnels_integer = securedInput(37, 4, "integer", 1, 1000, " ", " ")
	textOutput("Width of the tunnels ? ", 1, 5, 0)
	Width = securedInput(37, 5, "integer", 1, 1000, " ", " ")
	term.setCursorPos(1,6)
	textOutput("Height of the tunnels ? ", 1, 6, 0)
	Height = securedInput(37, 6, "integer", 1, 200, " ", " ")
	if (Height < 3) then
		Height = 3
	end
	term.setCursorPos(1,7)
	textOutput("Length of the tunnels ? ", 1, 7, 0)
	Length = securedInput(37, 7, "integer", 1, 100000, " ", " ")
	if (tunnels_integer > 1) then
		term.setCursorPos(1,8)
		textOutput("Separating blocks between tunnels ? ", 1, 8, 0)
		tunnels_separation = securedInput(37, 8, "integer", 1, 1000, " ", " ")
	else
		tunnels_separation = 0
	end	
	
	resetScreen()
	textOutput("To use regular chests, press c", 1, 4, 0)
	textOutput("To use an enderchest, press e", 1, 5, 0)
	textOutput("To use torches, press t", 1, 6, 0)
	textOutput("To throw away specific items, press p", 1, 7, 0)
	textOutput("Press enter once you have chosen all the options you wanted to activate.", 1, 11, 0)
	while true do
		press, key = os.pullEvent()
		if press == "key" and key == 28 then
			break
		elseif key == 46 then
			if Chest_approval then
				Chest_approval = false
				textOutput("", 10, 9, 11)
			else	
				Chest_approval = true
				textOutput("Chests,", 10, 9, 11)
			end
		elseif key == 18 then
			if enderchest then
				enderchest = not(enderchest)
				textOutput("", 10, 9, 11)
			else
				Chest_approval = true
				enderchest = true
				textOutput("Enderchest,", 10, 9, 11)
			end
		elseif key == 20 then
			if Torch_approval then
				Torch_approval = false
				textOutput("", 1, 9, 8)
			else
				Torch_approval = true
				textOutput("Torches,", 1, 9, 8)
			end
		elseif key == 25 then
			if throw_stuff then
				throw_stuff = not(throw_stuff)
				textOutput("", 22, 9, 12)			
			else	
				throw_stuff = true
				textOutput("Throw items.", 22, 9, 12)
			end	
		end	
	end
	resetScreen()
	
	textOutput("Do you want to save this configuration as your favorite ?", 1, 4, 0)
	New_favorite = securedInput(1, 6, "text", 0, 0, "Yes", "No")
	
	if (New_favorite == "y") then
		favorite = {}
		favorite.tunnels_integer = tunnels_integer
		favorite.Width = Width
		favorite.Height = Height
		favorite.Length = Length 
		favorite.tunnels_separation = tunnels_separation
		favorite.Torch_approval = Torch_approval
		favorite.Chest_approval = Chest_approval
		favorite.throw_stuff = throw_stuff
		favorite.enderchest = enderchest
		output = textutils.serialize(favorite)
		handle = fs.open("favorite", "w")
		handle.write(output)
		handle.close()
	end
end
resetScreen()
textOutput("To manage extra slots, press s", 1, 4, 0)
textOutput("This option allows you to have several torches/fuel/chests slots, as well as different items to throw", 1, 6, 0)
textOutput("Else, press enter to skip this step.", 1, 10, 0)
torches_slots, chests_slots, garbage_slots = 0, 0, 0	
while true do
	press, key = os.pullEvent()
	if press == "key" and key == 28 then
		fuel_slots = 1
		break
	elseif key == 31 then
		repeat
			turtle.select(1)
			resetScreen()
			textOutput("Number of fuel slots ? ", 1, 4, 0)
			fuel_slots = securedInput(29, 4, "integer", 1, 16, " ", " ")	
			slot_total = fuel_slots
			if Torch_approval then	
				textOutput("Number of torches slots ? ", 1, 5, 0)
				torches_slots = securedInput(29, 5, "integer", 1, 16, " ", " ")
				slot_total = slot_total + torches_slots
			end	
			if Chest_approval  and not(enderchest) then	
				textOutput("Number of chests slots ? ", 1, 6, 0)
				chests_slots = securedInput(29, 6, "integer", 1, 16, " ", " ")
				slot_total = slot_total + chests_slots
			end	
			if throw_stuff then	
				textOutput("Number of undesired items ? ", 1, 7, 0)
				garbage_slots = securedInput(29, 7, "integer", 1, 16, " ", " ")
				slot_total = slot_total + garbage_slots
			end
		until (slot_total < 16)
		break
	end
end
resetScreen()
if (tunnels_integer > 1) then
	textOutput("The first tunnel will be in front of the turtle. Do you want the tunnels to be dug on the right or on the left of the first tunnel (They will be parallel to the first one) ?", 1, 4, 0)
	Bool_direction = securedInput(1, 9, "text", 0, 0, "Right", "Left")
end
if (tunnels_integer == 1) and (Width > 1) then
	textOutput("In front of the turtle will be one side of the tunnel. Do you want it to mine the rest on the left or on the right ?", 1, 4, 0)
	Bool_direction = securedInput(1, 9, "text", 0, 0, "Right", "Left")
end
resetScreen()
if Torch_approval then
	if torches_slots > 1 then
		textOutput("Torches in the slots 1 to "..torches_slots, 1, 4, 0) 
	else
		torches_slots = 1
		textOutput("Torches in the slot 1", 1, 4, 0)
	end
end
if fuel_slots > 1 then
	textOutput("Fuel in the slots "..(torches_slots+1).." to "..(torches_slots+fuel_slots), 1, 5, 0)
else
	fuel_slots = 1
	textOutput("Fuel in the slot "..(torches_slots+1), 1, 5, 0)
end
if Chest_approval  and not(enderchest) then
	if chests_slots > 1 then
		textOutput("Chests in the slots "..(torches_slots+fuel_slots+1).." to "..(torches_slots+fuel_slots+chests_slots), 1, 6, 0)
	else
		chests_slots = 1
		textOutput("Chests in the slot "..(torches_slots+fuel_slots+1), 1, 6, 0)
	end
end		
if enderchest then
	textOutput("The enderchest in the slot "..(torches_slots+fuel_slots+1), 1, 6, 0)
	chests_slots = 1
end
if throw_stuff then
	if garbage_slots > 1 then
		textOutput("Please make sure there are samples of the items to throw in the slots "..(torches_slots+fuel_slots+chests_slots+1).." to "..(torches_slots+fuel_slots+chests_slots+garbage_slots), 1, 8, 0)
	else
		garbage_slots = 1
		textOutput("Please make sure there is a sample of the item to throw in the slot "..(torches_slots+fuel_slots+chests_slots+1), 1, 8, 0)
	end 
end  
if (Bool_direction == "r") then
	Bool_direction = true
else
	Bool_direction = false
end
textOutput("Press enter to start", 1, 11, 0)
while true do
	press, key = os.pullEvent()
	if press == "key" and key == 28 then
		break
	end	
end
resetScreen()
textOutput("", 1, 11, 20)
if Torch_approval and (turtle.getItemCount(1) == 0) then
	textOutput("The torches slot is empty. Are you sure you want to use torches ?", 1, 4, 0)
	Torch_approval = convertToBool(securedInput(1, 6, "text", 0, 0, "Yes", "No"), "y")
elseif Torch_approval and (turtle.getItemCount(1) ~= 0) then
	for u = 1, torches_slots-1 do
		turtle.select(u+1)
		if  not(turtle.compareTo(1)) then
			Torch_mismatch = true
		end
	end
	if Torch_mismatch then
		resetScreen()
		textOutput("All the slots dedicated to the torches have not been set up correctly. Are you sure you want to use torches ?", 1, 4, 0)
		Torch_approval = convertToBool(securedInput(1, 7, "text", 0, 0, "Yes", "No"), "y")
	end
end

if Chest_approval and (turtle.getItemCount(torches_slots + fuel_slots + 1) == 0) then
	resetScreen()
	textOutput("The chests slot is empty. Are you sure you want to use chests ?", 1, 4, 0)
	Chest_approval = convertToBool(securedInput(1, 6, "text", 0, 0, "Yes", "No"), "y")
elseif Chest_approval and (turtle.getItemCount(torches_slots + fuel_slots + 1) ~= 0) then
	for u = 1, chests_slots-1 do
		turtle.select(torches_slots + fuel_slots + u + 1)
		if  not(turtle.compareTo(torches_slots + fuel_slots + 1)) then
			Chest_mismatch = true
		end
	end	
	if Chest_mismatch then
		resetScreen()
		textOutput("All the slots dedicated to the chests have not been set up correctly. Are you sure you want to use chests ?", 1, 4, 0)
		Chest_approval = convertToBool(securedInput(1, 7, "text", 0, 0, "Yes", "No"), "y")
	end
end
if Torch_approval then
	empty_torches_slots = 0
	for u = 1, torches_slots do
		if turtle.getItemCount(u) == 0 then
		    empty_torches_slots = empty_torches_slots + 1
		end
	end
	if empty_torches_slots == torches_slots then
		shortage[1] = true
	end
	textOutput("No Torches -", 11, 11, 0)
end	
if Torch_approval and (turtle.getItemCount(1) ~= 0) then
	shortage[1] = false
	textOutput("Torches OK -", 11, 11, 0)
end
if Chest_approval then
	empty_chests_slots = 0
	for u = 1, chests_slots do
		if turtle.getItemCount(torches_slots + fuel_slots + u) == 0 then
		    empty_chests_slots = empty_chests_slots + 1
		end
	end
	if empty_chests_slots == chests_slots then
		shortage[3] = true
	end
	textOutput("No Chests -", 24, 11, 0)
end	
if Chest_approval and (turtle.getItemCount(torches_slots + fuel_slots + 1) ~= 0) then
	shortage[3] = false
	textOutput("Chests OK -", 24, 11, 0)
end
textOutput("Fuel OK -", 1, 11, 0)
refuel_count = 80 - turtle.getFuelLevel()
FacingAngle, tunnel_forth, current_slot= 0, true, {1, 1, 1}
refuel_count = moveUp(true, 1, refuel_count, false)
if (Width == 1) then
	refuel_count = moveForward(FacingAngle, true, 1, true, true, refuel_count)
end
for done_tunnels=1, tunnels_integer do
	if (Width >= 2) then
		for done_layers=1, math.ceil(Length/2) do
			refuel_count = moveForward(FacingAngle, true, 1, true, true, refuel_count)
			FacingAngle = turn(FacingAngle, Bool_direction, 1)
			refuel_count, Height_Position = digVerticalLayer(refuel_count, FacingAngle, Width, Height, "down", false, Bool_direction)
			FacingAngle = turn(FacingAngle, not(Bool_direction), 1)
			refuel_count = moveForward(FacingAngle, true, 1, true, true, refuel_count)
			FacingAngle = turn(FacingAngle, not(Bool_direction), 1)
			refuel_count, Height_Position = digVerticalLayer(refuel_count, FacingAngle, Width, Height, Height_Position, false, not(Bool_direction))
			FacingAngle = turn(FacingAngle, Bool_direction, 1)
			if (done_layers%4 == 0) then
				refuel_count = moveUp(false, 1, refuel_count, false)
				FacingAngle = turn(FacingAngle, Bool_direction, 1)
				placeTorch("front")
				FacingAngle = turn(FacingAngle, not(Bool_direction), 1)
				refuel_count = moveUp(true, 1, refuel_count, false)
			end
		end
	elseif (Width == 1) then
		refuel_count, Height_Position = digVerticalLayer(refuel_count, FacingAngle, 2*math.ceil(Length/2), Height, "down", true, Bool_direction) 
	end
	if (Height_Position == "up") then
		refuel_count = moveUp(false, (Height - 3), refuel_count, false)
		Height_Position = "down"
	end
	if tunnel_forth and (tunnels_integer - done_tunnels >= 1) then
		refuel_count = moveForward(FacingAngle, true, 1, true, true, refuel_count)
		FacingAngle = turn(FacingAngle, Bool_direction, 1)
		refuel_count, Height_Position = digVerticalLayer(refuel_count, FacingAngle, ((2*Width)+tunnels_separation), Height, "down", false, not(Bool_direction))
		if (Height_Position == "up") then
			refuel_count = moveUp(false, (Height - 3), refuel_count, false)
			Height_Position = "down"
		end
		FacingAngle = turn(FacingAngle, Bool_direction, 1)
		placeTorch("below")
	elseif not(tunnel_forth) then
		refuel_count = moveForward(FacingAngle, true, 1, true, false, refuel_count)
		FacingAngle = turn(FacingAngle, Bool_direction, 1)
		refuel_count, Height_Position = digVerticalLayer(refuel_count, FacingAngle, ((2*Width)-1+tunnels_separation), Height, "down", false, Bool_direction)
		FacingAngle = turn(FacingAngle, not(Bool_direction), 1)
		refuel_count = moveForward(FacingAngle, true, 1, true, true, refuel_count)
		FacingAngle = turn(FacingAngle, not(Bool_direction), 1)
		refuel_count, Height_Position = digVerticalLayer(refuel_count, FacingAngle, ((2*Width)-1+tunnels_separation), Height, Height_Position, false, not(Bool_direction))
		if (Height_Position == "up") then
			refuel_count = moveUp(false, (Height - 3), refuel_count, false)
			Height_Position = "down"
		end
		FacingAngle = turn(FacingAngle, Bool_direction, 2)
		refuel_count = moveForward(FacingAngle, true, (Width-2), true, true, refuel_count)
		placeTorch("front")
		FacingAngle = turn(FacingAngle, not(Bool_direction), 2)
		refuel_count = moveForward(FacingAngle, true, (Width-2), true, true, refuel_count)
		if (tunnels_integer - done_tunnels ~= 0) then
			refuel_count = moveForward(FacingAngle, true, 1, true, true, refuel_count)
			refuel_count, Height_Position = digVerticalLayer(refuel_count, FacingAngle, (tunnels_separation+1), Height, Height_Position, false, Bool_direction)
			FacingAngle = turn(FacingAngle, not(Bool_direction), 1)
			refuel_count = moveForward(FacingAngle, true, 1, true, true, refuel_count)
			FacingAngle = turn(FacingAngle, not(Bool_direction), 1)
			refuel_count, Height_Position = digVerticalLayer(refuel_count, FacingAngle, (tunnels_separation+1), Height, Height_Position, false, not(Bool_direction))
			refuel_count = moveForward(FacingAngle, false, tunnels_separation, true, true, refuel_count)
			FacingAngle = turn(FacingAngle, not(Bool_direction), 1)
			placeTorch("front")
			FacingAngle = turn(FacingAngle, not(Bool_direction), 2)
		end	
	end
	if tunnel_forth and (tunnels_integer - done_tunnels == 0) and (Width > 1) then
		refuel_count = moveForward(FacingAngle, false, 2*math.ceil(Length/2), false, false, refuel_count)
		FacingAngle = turn(FacingAngle, Bool_direction, 1)
		refuel_count = moveForward(FacingAngle, true, 1, false, false, refuel_count)
		refuel_count, Height_Position = digVerticalLayer(refuel_count, FacingAngle, (Width - 1), Height, Height_Position, false, Bool_direction)
		FacingAngle = turn(FacingAngle, Bool_direction, 1)
		refuel_count = moveForward(FacingAngle, true, 1, false, false, refuel_count)
		FacingAngle = turn(FacingAngle, Bool_direction, 1)
		refuel_count, Height_Position = digVerticalLayer(refuel_count, FacingAngle, (Width - 1), Height, Height_Position, false, not(Bool_direction))
		if (Height_Position == "up") then
			refuel_count = moveUp(false, (Height - 3), refuel_count, false)
			Height_Position = "down"
		end
		refuel_count = moveForward(FacingAngle, false, (Width - 2), false, false, refuel_count)
		FacingAngle = turn(FacingAngle, Bool_direction, 2)
	end
	if (Width == 1) and (tunnels_integer - done_tunnels ~= 0) then
		refuel_count = moveForward(FacingAngle, true, 1, true, true, refuel_count)
	elseif (Width == 1) and (tunnels_integer - done_tunnels == 0) and tunnel_forth then
		refuel_count = moveForward(FacingAngle, false, (2*math.ceil(Length/2)), false, false, refuel_count)
	end
	tunnel_forth = not(tunnel_forth)
end
refuel_count = moveUp(false, 1, refuel_count, false)
if (Width == 1) and not(tunnel_forth) then
	refuel_count = moveForward(FacingAngle, false, 1, false, false, refuel_count)
	turn(FacingAngle, Bool_direction, 1)
end
refuel_count = moveForward(FacingAngle, false, ((tunnels_integer*Width) - 1 + (tunnels_separation*(tunnels_integer - 1))), false, false, refuel_count)
FacingAngle = turn(FacingAngle, not(Bool_direction), 1)
refuel_count = moveForward(FacingAngle, true, 1, false, false, refuel_count)
resetScreen()
write("Done. I hope I worked well !")
term.setCursorPos(1,8)
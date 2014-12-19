class UsersController < ApplicationController
	def create
		@user = User.new(user_params)
		if @user.save
			login(@user)
			render json: { success: @user.id }
		else
			render json: { errors: @user.errors.full_messages }
		end
	end

	def show
		# if current_user.id == params[:id]
		@user = User.includes(
			:profile_image, 
			owned_lairs: :images
			# reservations: [:lair, { guest: :profile_image }], 
			# trips: { lair: :images }
		).find(params[:id])
	end

	def user_params
		params.require(:user).permit(:id, :first_name, :last_name, :email, :password, :image_url)
	end
end

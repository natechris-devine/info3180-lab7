from flask_wtf import FlaskForm
from wtforms import TextAreaField
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms.validators import DataRequired

class UploadForm(FlaskForm):
    description = TextAreaField('description', validators=[DataRequired(message="Description required")])
    photo = FileField('photo', validators=[FileRequired(), FileAllowed(['jpg', 'png'], 'Image Required')])


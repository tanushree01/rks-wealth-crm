const { body } = require('express-validator');

exports.registerValidation = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').isMobilePhone().withMessage('Valid phone number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
  body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender selection'),
  body('address').notEmpty().withMessage('Address is required'),
  body('maritalStatus').isIn(['Single', 'Married', 'Divorced', 'Widowed']).withMessage('Invalid marital status'),
  body('userType').isIn(['Admin', 'RM', 'SERVICE_RM']).withMessage('Invalid user type'),
];

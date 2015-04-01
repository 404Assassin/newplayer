(function () {
    'use strict';
    angular
            .module('newplayer.component')
            /** @ngInject */
            .controller('npQuestionController',
                    function ($log, $scope, $rootScope, ManifestService, $sce, $element) {
                      var vm = this,
                          cmpData = $scope.component.data;

                        $log.debug('npQuestion::data', cmpData);
                        vm.id = cmpData.id;
                        vm.content = $sce.trustAsHtml(cmpData.content);
                        vm.type = cmpData.type;
                        vm.feedback = '';
                        vm.canContinue = false;
                        vm.answers = [];
                        //vm.answer = [];

                        var feedback = cmpData.feedback;
                        var feedback_label = $element.find('.question-feedback-label');
                        var feedback_checkbox_x = $element.find('.checkbox-x');
                        var negativeFeedbackIcon = '';
//                        console.log(
//                                '\n::::::::::::::::::::::::::::::::::::::npQuestions::default:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                '\n:::', vm,
//                                '\n::type::', cmpData.type,
//                                '\n::feedback::', feedback,
//                                '\n::feedback_label::', feedback_label,
//                                '\n::$element::', $element,
//                                '\n::feedback_checkbox_x::', feedback_checkbox_x,
//                                '\n::$element.find(".checkbox-x")::', $element.find(".checkbox-x"),
//                                '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                );
                        vm.answerChanged = function (changedAnswer) {
//                            console.log(
//                                    '\n::::::::::::::::::::::::::::::::::::::npQuestions::changed:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                    '\n::id::', event,
//                                    '\n::id::', event.target,
//                                    '\n::id::', event.currentTarget,
//                                    '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                    );

                            $log.debug('npQuestion::answer changed', vm.answers);

                          // if this is a radio, clear the other radios
                            if( vm.type === 'radio' ) {
                              vm.answers.forEach(function (answer, index, array) {
                                if( answer !== changedAnswer ) {
                                  answer.clear();
                                }
                              });
                            }

                          // TODO: Should this trigger a full evaluation on change or just for this element?
                            if (feedback.immediate) {
                                vm.feedback = '';
                                negativeFeedbackIcon = $element.find('.negative-feedback-icon');
                                TweenMax.set(negativeFeedbackIcon, {opacity: 0, scale: 2.5, force3D: true});
                            }
                        };
                        vm.registerAnswer = function(idx, answer) {
                          vm.answers[idx] = answer;

                          $log.debug('CHECKBOX registerAnswer: ', idx, answer, vm.answers);
                        };
                        vm.evaluate = function () {
                            var i, isCorrectAnswer = true;
                            negativeFeedbackIcon = $element.find('.negative-feedback-icon');

//                            console.log(
//                                    '\n::::::::::::::::::::::::::::::::::::::npQuestions::evaluate:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                    '\n::vm::', vm,
//                                    '\n::vm.answer::', vm.answer,
//                                    '\n::cmpData::', cmpData,
//                                    '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                    );
                            $log.debug('npQuestion::evaluate:', vm.answer, vm.answers);
                            if (!!vm.answers) {
                                switch (vm.type) {
                                    case 'radio':
                                        //var radAnswer = ManifestService.getComponent(vm.answers);
                                        //if (angular.isString(radAnswer.data.feedback)) {
                                        //    vm.feedback = radAnswer.data.feedback;
                                        //}
                                        //correct = radAnswer.data.correct;

                                        for( i=0; i < vm.answers.length; i++ ) {
                                          if( vm.answers[i].checked === false ) {
                                            continue;
                                          }

                                          isCorrectAnswer = vm.answers[i].isCorrect;
                                        }

                                        break; case 'checkbox':

                                    // Answers are only correct if all of their check states match their isCorrect state.
                                      for( i=0; i < vm.answers.length; i++ ) {
                                        isCorrectAnswer = isCorrectAnswer && vm.answers[i].checked === vm.answers[i].isCorrect;
                                      }


                                        //var chkAnswers = ManifestService.getAll('npAnswer', $scope.cmpIdx);
                                        //var idx;
                                        //for (idx in chkAnswers) {
                                        //    if (chkAnswers[idx].data.correct) {
                                        //        console.log(
                                        //                '\n::::::::::::::::::::::::::::::::::::::npQuestions::default:::::::::::::::::::::::::::::::::::::::::::::::::',
                                        //                '\n::idx::', idx,
                                        //                '\n::chkAnswers::', chkAnswers,
                                        //                '\n::vm.answer[chkAnswers[idx].idx]::', vm.answer[chkAnswers[idx].idx],
                                        //                '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                        //                );
                                        //        // confirm all correct answers were checked
                                        //        if (!vm.answer[chkAnswers[idx].idx]) {
                                        //            isCorrectAnswer = false;
                                        //        }
                                        //    } else {
                                        //        // confirm no incorrect answers were checked
                                        //        if (vm.answer[chkAnswers[idx].idx]) {
                                        //            isCorrectAnswer = false;
                                        //        }
                                        //    }
                                        //}
                                        break;
                                    case 'text':
                                        var txtAnswer = ManifestService.getFirst('npAnswer', $scope.cmpIdx);
                                        var key = txtAnswer.data.correct;
                                        var regExp, pat, mod = 'i';
                                        if (angular.isString(key)) {
                                            if (key.indexOf('/') === 0) {
                                                pat = key.substring(1, key.lastIndexOf('/'));
                                                mod = key.substring(key.lastIndexOf('/') + 1);
                                            }
                                        } else if (angular.isArray(key)) {
                                            pat = '^(' + key.join('|') + ')$';
                                        }
                                        regExp = new RegExp(pat, mod);
                                        if (!regExp.test(vm.answer)) {
                                            if (angular.isObject(txtAnswer.data.feedback) && angular.isString(txtAnswer.data.feedback.incorrect)) {
                                                vm.feedback = txtAnswer.data.feedback.incorrect;
                                                feedback_label.remove();
                                            }
                                            isCorrectAnswer = false;
                                        } else {
                                            if (angular.isObject(txtAnswer.data.feedback) && angular.isString(txtAnswer.data.feedback.correct)) {
                                                vm.feedback = txtAnswer.data.feedback.correct;
                                                feedback_label.remove();
                                            }
                                        }
                                        break;
                                }
                            } else {
                                isCorrectAnswer = false;
                            }

                            $log.debug('npQuestion::evaluate:isCorrect', isCorrectAnswer);


                            // NOTE: feedback.correct/incorrect is set on the npQuestion's data, NOT npAnswer
                            if (feedback.immediate && vm.feedback === '') {
                              var tweenOpts = {
                                      opacity: 1,
                                      scale: 1,
                                      force3D: true
                                  };

                                feedback_label.remove();


                                if (isCorrectAnswer) {
                                    vm.feedback = feedback.correct;
                                    vm.canContinue = true;
                                  tweenOpts.opacity = 0;
                                } else {
                                    vm.feedback = feedback.incorrect;
                                    vm.canContinue = false;
                                }

                              TweenMax.to(negativeFeedbackIcon, 0.75, tweenOpts);
                            }
                        };
                        vm.nextPage = function (evt) {
                            evt.preventDefault();
                            if (vm.canContinue) {
                                $rootScope.$emit('question.answered', true);
                            }
                        };
                    }
            )
            .directive('questionFeedbackBuild', function () {
                return function ($scope, $element, attrs) {
                    var negativeFeedbackIcon = '';
                    setTimeout(function () {
                        $scope.$apply(function () {
                            negativeFeedbackIcon = $element.find('.hotspotButton');
                            function onPageLoadBuild() {
                                negativeFeedbackIcon = $('.negative-feedback-icon');
                                TweenMax.set(negativeFeedbackIcon, {opacity: 0, scale: 2.5, force3D: true});
//                                TweenMax.set(hotspotButton, {opacity: 0, scale: .25, force3D: true});
//                                TweenMax.staggerTo(hotspotButton, 2, {scale: 1, opacity: 1, delay: 0.5, ease: Elastic.easeOut, force3D: true}, 0.2);
                            }
                            onPageLoadBuild();
                        });
                    });
                };
            })
            /** @ngInject */
            .run(
                    function ($log, $rootScope) {
                        $log.debug('npQuestion::component loaded!');
                    }
            );
})();

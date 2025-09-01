const Faq = require('./faqModel');

const logger = require('../../common/utils/logger');

// Generate FAQ ID with pattern FAQ_001, FAQ_002, etc.
const generateFaqId = async () => {
    try {
        const count = await Faq.countDocuments();
        const nextNumber = count + 1;
        return `FAQ_${nextNumber.toString().padStart(3, '0')}`;
    } catch (error) {
        logger.error('Error generating FAQ ID:', error);
        throw new Error('Failed to generate FAQ ID');
    }
};

// Get all FAQs
const getAllFaqs = async (includeDisabled = false) => {
    try {
        const query = {};
        if (!includeDisabled) {
            query.isEnabled = true;
        }
        return await Faq.find(query).sort({ createdAt: -1 });
    } catch (error) {
        logger.error('Error fetching all FAQs:', error);
        throw new Error('Failed to fetch FAQs');
    }
};

// Get FAQs by category
const getFaqsByCategory = async (category, includeDisabled = false) => {
    try {
        let query = {};

        // For customer portal, include customer and general FAQs
        if (category === 'customer') {
            query.category = { $in: ['customer', 'general'] };
        }
        // For provider portal, include provider and general FAQs
        else if (category === 'provider') {
            query.category = { $in: ['provider', 'general'] };
        }
        // For general category, only include general FAQs
        else {
            query.category = category;
        }

        if (!includeDisabled) {
            query.isEnabled = true;
        }

        return await Faq.find(query).sort({ createdAt: -1 });
    } catch (error) {
        logger.error('Error fetching FAQs by category:', error);
        throw new Error('Failed to fetch FAQs by category');
    }
};

// Search FAQs with advanced scoring
const searchFaqs = async (category, query) => {
    try {
        const searchQuery = query.trim().toLowerCase();

        // Common synonyms mapping
        const synonyms = {
            account: [
                'profile',
                'user',
                'signup',
                'sign up',
                'register',
                'registration',
            ],
            create: ['make', 'set up', 'setup', 'open', 'start', 'begin'],
            book: ['reserve', 'schedule', 'appointment', 'booking'],
            cancel: ['cancel', 'cancellation', 'canceled', 'cancelled'],
            payment: [
                'pay',
                'paying',
                'paid',
                'money',
                'credit',
                'debit',
                'card',
            ],
            refund: ['money back', 'return', 'reimbursement'],
            support: ['help', 'assistance', 'contact', 'customer service'],
            service: ['work', 'job', 'task', 'help'],
            provider: ['worker', 'professional', 'expert', 'specialist'],
            review: ['rating', 'feedback', 'comment', 'opinion'],
            secure: ['safe', 'protected', 'private', 'confidential'],
            verify: ['verified', 'check', 'confirm', 'validate'],
            reschedule: ['change time', 'move appointment', 'postpone'],
            satisfied: ['happy', 'pleased', 'content', 'good'],
            problem: ['issue', 'trouble', 'difficulty', 'concern'],
            how: ['what', 'where', 'when', 'why'],
            do: ['does', 'did', 'doing'],
            can: ['could', 'would', 'should', 'may'],
            get: ['receive', 'obtain', 'find', 'access'],
            use: ['utilize', 'employ', 'apply'],
            change: ['modify', 'alter', 'update', 'edit'],
            delete: ['remove', 'erase', 'eliminate'],
            add: ['create', 'make', 'insert', 'include'],
            find: ['search', 'locate', 'discover'],
            contact: ['reach', 'get in touch', 'call', 'email'],
            information: ['info', 'details', 'data', 'facts'],
            personal: ['private', 'individual', 'own'],
            data: ['information', 'details', 'records'],
            safe: ['secure', 'protected', 'secure'],
            money: ['payment', 'cost', 'price', 'fee'],
            time: ['schedule', 'appointment', 'date', 'when'],
            location: ['place', 'address', 'where', 'area'],
            quality: ['good', 'excellent', 'great', 'best'],
            price: ['cost', 'fee', 'charge', 'amount'],
            available: ['free', 'open', 'ready', 'accessible'],
            quick: ['fast', 'rapid', 'speedy', 'immediate'],
            easy: ['simple', 'straightforward', 'uncomplicated'],
            difficult: ['hard', 'complicated', 'complex', 'challenging'],
            important: ['essential', 'crucial', 'vital', 'necessary'],
            new: ['fresh', 'recent', 'latest', 'current'],
            old: ['previous', 'former', 'past', 'earlier'],
            big: ['large', 'huge', 'major', 'significant'],
            small: ['little', 'minor', 'tiny', 'minimal'],
            good: ['great', 'excellent', 'fine', 'nice'],
            bad: ['poor', 'terrible', 'awful', 'horrible'],
            yes: ['sure', 'okay', 'alright', 'fine'],
            no: ['not', 'never', 'none', 'zero'],
        };

        // Expand search terms with synonyms
        const expandSearchTerms = (terms) => {
            const expanded = [...terms];
            terms.forEach((term) => {
                if (synonyms[term]) {
                    expanded.push(...synonyms[term]);
                }
            });
            return [...new Set(expanded)];
        };

        // Create search terms array
        const searchTerms = searchQuery
            .split(/\s+/)
            .filter((term) => term.length > 2)
            .map((term) => term.replace(/[^\w\s]/g, ''));

        if (searchTerms.length === 0) {
            return [];
        }

        const expandedSearchTerms = expandSearchTerms(searchTerms);

        // Find FAQs based on category
        const categoryQuery =
            category === 'customer'
                ? { category: { $in: ['customer', 'general'] } }
                : { category: { $in: ['provider', 'general'] } };

        const faqs = await Faq.find({
            ...categoryQuery,
            isEnabled: true,
        }).sort({ createdAt: -1 });

        // Score and filter FAQs based on relevance
        const scoredFaqs = faqs
            .map((faq) => {
                let score = 0;
                const questionLower = faq.question.toLowerCase();
                const answerLower = faq.answer.toLowerCase();
                const faqIdLower = faq.faqId.toLowerCase();

                // Calculate word match scores
                let questionWordMatches = 0;
                let answerWordMatches = 0;

                // Check original search terms (higher weight)
                searchTerms.forEach((term) => {
                    const regex = new RegExp(term, 'i');

                    if (questionLower.includes(term)) {
                        score += 25;
                        questionWordMatches++;
                    }

                    if (regex.test(questionLower)) {
                        score += 20;
                    }

                    if (answerLower.includes(term)) {
                        score += 10;
                        answerWordMatches++;
                    }

                    if (regex.test(answerLower)) {
                        score += 8;
                    }

                    if (faqIdLower.includes(term)) {
                        score += 5;
                    }
                });

                // Check expanded search terms (lower weight)
                expandedSearchTerms.forEach((term) => {
                    if (!searchTerms.includes(term)) {
                        const regex = new RegExp(term, 'i');

                        if (questionLower.includes(term)) {
                            score += 12;
                            questionWordMatches++;
                        }

                        if (regex.test(questionLower)) {
                            score += 10;
                        }

                        if (answerLower.includes(term)) {
                            score += 6;
                            answerWordMatches++;
                        }

                        if (regex.test(answerLower)) {
                            score += 4;
                        }
                    }
                });

                // Bonus for exact phrase match
                if (
                    questionLower.includes(searchQuery) ||
                    answerLower.includes(searchQuery)
                ) {
                    score += 50;
                }

                // Bonus for matching multiple terms
                const matchedTermsInQuestion = searchTerms.filter((term) =>
                    questionLower.includes(term)
                );
                if (matchedTermsInQuestion.length > 1) {
                    score += matchedTermsInQuestion.length * 15;
                }

                const matchedTermsInAnswer = searchTerms.filter((term) =>
                    answerLower.includes(term)
                );
                if (matchedTermsInAnswer.length > 1) {
                    score += matchedTermsInAnswer.length * 8;
                }

                // Calculate relevance ratio
                const totalSearchTerms = searchTerms.length;
                const relevantMatches = questionWordMatches + answerWordMatches;
                const relevanceRatio = relevantMatches / totalSearchTerms;

                // Apply relevance threshold
                if (relevanceRatio < 0.3 && score < 30) {
                    score = 0;
                }

                // Bonus for high relevance ratio
                if (relevanceRatio >= 0.7) {
                    score += 20;
                } else if (relevanceRatio >= 0.5) {
                    score += 10;
                }

                return { faq, score, relevanceRatio };
            })
            .filter((item) => item.score > 20)
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map((item) => item.faq);

        return scoredFaqs;
    } catch (error) {
        logger.error('Error searching FAQs:', error);
        throw new Error('Failed to search FAQs');
    }
};

// Get FAQ by ID
const getFaqById = async (id) => {
    try {
        return await Faq.findById(id);
    } catch (error) {
        logger.error('Error fetching FAQ by ID:', error);
        throw new Error('Failed to fetch FAQ');
    }
};

// Create new FAQ
const createFaq = async (category, question, answer, user = 'admin') => {
    try {
        const faqId = await generateFaqId();
        const faq = new Faq({
            faqId,
            category,
            question: question.trim(),
            answer: answer.trim(),
            isEnabled: true,
            user,
        });

        return await faq.save();
    } catch (error) {
        logger.error('Error creating FAQ:', error);
        throw new Error('Failed to create FAQ');
    }
};

// Update FAQ
const updateFaq = async (id, category, question, answer, user = 'admin') => {
    try {
        return await Faq.findByIdAndUpdate(
            id,
            {
                category,
                question: question.trim(),
                answer: answer.trim(),
                user,
            },
            { new: true, runValidators: true }
        );
    } catch (error) {
        logger.error('Error updating FAQ:', error);
        throw new Error('Failed to update FAQ');
    }
};

// Toggle FAQ status
const toggleFaqStatus = async (id) => {
    try {
        const faq = await Faq.findById(id);
        if (!faq) {
            return null;
        }

        faq.isEnabled = !faq.isEnabled;
        return await faq.save();
    } catch (error) {
        logger.error('Error toggling FAQ status:', error);
        throw new Error('Failed to toggle FAQ status');
    }
};

// Delete FAQ
const deleteFaq = async (id) => {
    try {
        const deletedFaq = await Faq.findByIdAndDelete(id);
        if (deletedFaq) {
            // Reorder FAQ IDs after deletion
            await reorderFaqIds();
        }
        return deletedFaq;
    } catch (error) {
        logger.error('Error deleting FAQ:', error);
        throw new Error('Failed to delete FAQ');
    }
};

// Helper function to reorder FAQ IDs after deletion
const reorderFaqIds = async () => {
    try {
        const faqs = await Faq.find({}).sort({ createdAt: 1 });

        for (let i = 0; i < faqs.length; i++) {
            const newFaqId = `FAQ_${(i + 1).toString().padStart(3, '0')}`;

            if (faqs[i].faqId !== newFaqId) {
                await Faq.findByIdAndUpdate(faqs[i]._id, {
                    faqId: newFaqId,
                });
                logger.info(
                    `Reordered FAQ ID: ${faqs[i].faqId} -> ${newFaqId}`
                );
            }
        }

        logger.info('FAQ ID reordering completed');
    } catch (error) {
        logger.error('Error reordering FAQ IDs:', error);
        throw error;
    }
};

module.exports = {
    getAllFaqs,
    getFaqsByCategory,
    searchFaqs,
    getFaqById,
    createFaq,
    updateFaq,
    toggleFaqStatus,
    deleteFaq,
};

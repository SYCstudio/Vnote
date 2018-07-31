# Messenger
[CF631D]

Each employee of the "Blake Techologies" company uses a special messaging app "Blake Messenger". All the stuff likes this app and uses it constantly. However, some important futures are missing. For example, many users want to be able to search through the message history. It was already announced that the new feature will appear in the nearest update, when developers faced some troubles that only you may help them to solve.  
All the messages are represented as a strings consisting of only lowercase English letters. In order to reduce the network load strings are represented in the special compressed form. Compression algorithm works as follows: string is represented as a concatenation of n blocks, each block containing only equal characters. One block may be described as a pair (li, ci), where li is the length of the i-th block and ci is the corresponding letter. Thus, the string s may be written as the sequence of pairs ![CF631D](_v_images/_cf631d_1533036378_246357104.png)    
Your task is to write the program, that given two compressed string t and s finds all occurrences of s in t. Developers know that there may be many such occurrences, so they only ask you to find the number of them. Note that p is the starting position of some occurrence of s in t if and only if tptp + 1...tp + |s| - 1 = s, where ti is the i-th character of string t.  
Note that the way to represent the string in compressed form may not be unique. For example string "aaaa" may be given as![CF631D-2](_v_images/_cf631d2_1533036410_41401355.png)![CF631D-2](_v_images/_cf631d2_1533036418_1269040524.png)![CF631D-2](_v_images/_cf631d2_1533036429_1472720780.png)

给定两个压缩的字符串，求第二个在第一个中出现的次数。

首先把相邻相同字符合并，如果第二个串长度小于等于$2$，则直接在里面匹配。否则，丢掉前后两位，因为中间的必须要求长度和字符都相同，然后就可以用$KMP$匹配了。当匹配到最后一位的时候，再把原来的第一位和最后一位放进来判断一下是否存在。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=201000;
const int inf=2147483647;

class Data{
public:
	ll t;
	char c;
};

int n,m;
Data S[maxN],T[maxN];
int Next[maxN];

int main(){
	scanf("%d%d",&n,&m);
	int t1=0;
	for (int i=1;i<=n;i++){
		ll k;char c;scanf("%lld-%c",&k,&c);
		if (c==S[t1].c) S[t1].t+=k;
		else S[++t1]=((Data){k,c});
	}
	n=t1;t1=0;
	for (int i=1;i<=m;i++){
		ll k;char c;scanf("%lld-%c",&k,&c);
		if (c==T[t1].c) T[t1].t+=k;
		else T[++t1]=((Data){k,c});
	}
	m=t1;

	Next[1]=Next[2]=1;
	for (int i=3;i<m;i++){
		int j=Next[i-1];
		while ((j!=1)&&((T[j+1].c!=T[i].c)||(T[j+1].t!=T[i].t))) j=Next[j];
		if ((T[j+1].c==T[i].c)&&(T[j+1].t==T[i].t)) j++;Next[i]=j;
	}

	ll Ans=0;
	if (m==1){
		for (int i=1;i<=n;i++) if ((S[i].c==T[1].c)&&(S[i].t>=T[1].t)) Ans=Ans+(S[i].t-T[1].t+1);
		printf("%lld\n",Ans);
	}
	else if (m==2){
		for (int i=1;i<n;i++) if ((S[i].c==T[1].c)&&(S[i].t>=T[1].t)&&(S[i+1].c==T[2].c)&&(S[i+1].t>=T[2].t)) Ans++;
		printf("%lld\n",Ans);
	}
	else{
		for (int i=1,j=1;i<=n;i++){
			while ((j!=1)&&((T[j+1].c!=S[i].c)||(T[j+1].t!=S[i].t))) j=Next[j];
			if ((T[j+1].c==S[i].c)&&(T[j+1].t==S[i].t)) j++;
			if (j==m-1){
				if ((S[i-m+2].c==T[1].c)&&(S[i-m+2].t>=T[1].t)&&(S[i+1].c==T[m].c)&&(S[i+1].t>=T[m].t)) Ans++;
				j=Next[j];
			}
		}
		printf("%lld\n",Ans);
	}

	return 0;
}
```
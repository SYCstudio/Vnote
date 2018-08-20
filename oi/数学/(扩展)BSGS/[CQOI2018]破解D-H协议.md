# [CQOI2018]破解D-H协议
[BZOJ5296 Luogu4454]

Diffie-Hellman密钥交换协议是一种简单有效的密钥交换方法。它可以让通讯双方在没有事先约定密钥(密码) 的情况下，通过不安全的信道(可能被窃听) 建立一个安全的密钥K,用于加密之后的通讯内容。  
假定通讯双方名为Alice和Bob,协议的工作过程描述如下(其中 mod 表示取模运算) :  
协议规定一个固定的质数P,以及模P 的一个原根g。P 和g 的数值都是公开的，无需保密。
Alice 生成一个随机数a,并计算 $A=g^a\;mod\;P$ , 将A 通过不安全信道发送给Bob。  
Bob 生成一个随机数b,并计算 $B=g^b\;mod\;P$ ,将B 通过不安全信道发送给Alice。  
Bob 根据收到的A 计算出 $K=A^b\;mod\;P$ ,而Alice 根据收到的B 计算出 $K=B^a\;mod\;P$ 。  
双方得到了相同的K,即 $g^{ab}\;mod\;P$ 。K 可以用于之后通讯的加密密钥。  
可见，这个过程中可能被窃听的只有A、B,而a、b、K 是保密的。并且根据A、B、P、g 这4个数,不能轻易计算出K,因此K 可以作为一个安全的密钥。  
当然安全是相对的，该协议的安全性取决于数值的大小，通常a、b、P 都选取数百位以上的大整数以避免被破解。然而如果Alice 和Bob 编程时偷懒，为了避免实现大数运算,选择的数值都小于 $2^{31}$ ,那么破解他们的密钥就比较容易了。

即求 $g ^ a \equiv A \mod p,g ^ b \equiv B \mod p$，直接 $BSGS$ 。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstdlib>
#include<algorithm>
#include<map>
#include<cmath>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

map<int,int> M;

int QPow(int x,int cnt,int P);

int main(){
	int g,P;scanf("%d%d",&g,&P);
	int m=ceil(sqrt(P));

	int bs=QPow(g,m,P),now=1;
	
	for (int i=1;i<=m;i++){
		now=1ll*now*bs%P;
		M[now]=i;
	}

	int T;scanf("%d",&T);
	while (T--){
		int A,B;scanf("%d%d",&A,&B);
		int a,b;
		int now=A;
		for (int i=0;i<=m;i++){
			if (M.count(now)){
				a=M[now]*m-i;break;
			}
			now=1ll*now*g%P;
		}
		now=B;
		for (int i=0;i<=m;i++){
			if (M.count(now)){
				b=M[now]*m-i;break;
			}
			now=1ll*now*g%P;
		}

		printf("%d\n",QPow(g,1ll*a*b%(P-1),P));
	}

	return 0;
}

int QPow(int x,int cnt,int P){
	int ret=1;
	while (cnt){
		if (cnt&1) ret=1ll*ret*x%P;
		x=1ll*x*x%P;cnt>>=1;
	}
	return ret;
}
```